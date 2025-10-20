import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, TextField, Card, CardContent, CardMedia, CardActions, IconButton, LinearProgress, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Select, MenuItem, InputLabel } from '@mui/material'
import { storage } from '../utils/firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { loadProgress } from '../utils/progress'
import { db } from '../utils/firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { Edit, Trash2, Save, X, ExternalLink } from 'lucide-react'

const StoragePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [items, setItems] = useState<Array<{ id: string; url: string; displayName: string; note?: string; path: string; contentType?: string; createdAtMs?: number | null }>>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editNoteId, setEditNoteId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all'|'image'|'video'|'audio'>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  useEffect(() => {
    // Reuse device id from progress doc
    loadProgress().then(p => setDeviceId(p.deviceId)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!deviceId) return
    const col = collection(db, 'storageItems')
    const q = query(col, where('deviceId', '==', deviceId), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, async (snap) => {
      const list = await Promise.all(snap.docs.map(async d => {
        const data = d.data() as any
        const url = await getDownloadURL(ref(storage, data.path)).catch(() => '')
        return {
          id: d.id,
          url,
          displayName: data.displayName || data.originalName || data.path.split('/').pop() || 'Tệp',
          note: data.note || '',
          path: data.path,
          contentType: data.contentType,
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : null,
        }
      }))
      setItems(list)
    })
    return () => unsub()
  }, [deviceId])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  const uploadSingle = async (f: File) => {
    const ts = Date.now()
    const path = `storage/${deviceId}/${ts}-${f.name}`
    const fileRef = ref(storage, path)
    const task = uploadBytesResumable(fileRef, f)
    task.on('state_changed', (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      setProgress(pct)
    })
    await task
    const url = await getDownloadURL(fileRef)
    await addDoc(collection(db, 'storageItems'), {
      deviceId,
      path,
      url,
      originalName: f.name,
      displayName: f.name,
      note: note || '',
      contentType: f.type,
      size: f.size,
      createdAt: serverTimestamp(),
    })
  }

  const handleUpload = async () => {
    if (!file || !deviceId) return
    setUploading(true)
    setProgress(0)
    try {
      await uploadSingle(file)
      setFile(null)
      setNote('')
      setProgress(null)
    } catch (e) {
      console.warn('Upload failed:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!deviceId) return
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)
    try {
      for (const f of files) {
        await uploadSingle(f)
      }
    } catch (e) {
      console.warn('DnD upload failed:', e)
    } finally {
      setUploading(false)
      setProgress(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      mediaRecorderRef.current = rec
      audioChunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      rec.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const fileAudio = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' })
        setFile(fileAudio)
      }
      rec.start()
      setRecording(true)
    } catch (e) {
      console.warn('Mic permission / record failed:', e)
    }
  }

  const stopRecording = () => {
    const rec = mediaRecorderRef.current
    if (!rec) return
    rec.stop()
    rec.stream.getTracks().forEach(t => t.stop())
    setRecording(false)
  }

  const handleDelete = async (id: string, path: string) => {
    try {
      await deleteObject(ref(storage, path))
    } catch (e) {
      console.warn('Delete object failed (continuing to remove doc):', e)
    }
    try {
      await deleteDoc(doc(db, 'storageItems', id))
    } catch (e) {
      console.warn('Delete doc failed:', e)
    }
  }

  const handleStartRename = (it: { id: string; displayName: string }) => {
    setEditId(it.id)
    setEditName(it.displayName)
  }

  const handleSaveRename = async () => {
    if (!editId) return
    try {
      await updateDoc(doc(db, 'storageItems', editId), { displayName: editName })
    } catch (e) {
      console.warn('Rename failed:', e)
    } finally {
      setEditId(null)
      setEditName('')
    }
  }

  const handleCancelRename = () => {
    setEditId(null)
    setEditName('')
  }

  const handleStartEditNote = (it: { id: string; note?: string }) => {
    setEditNoteId(it.id)
    setEditNote(it.note || '')
  }

  const handleSaveNote = async () => {
    if (!editNoteId) return
    try {
      await updateDoc(doc(db, 'storageItems', editNoteId), { note: editNote })
    } catch (e) {
      console.warn('Save note failed:', e)
    } finally {
      setEditNoteId(null)
      setEditNote('')
    }
  }

  const handleCancelNote = () => {
    setEditNoteId(null)
    setEditNote('')
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectAll = () => {
    setSelectedIds(new Set(items.map(i => i.id)))
  }

  const clearSelection = () => setSelectedIds(new Set())

  const openConfirmDelete = () => setConfirmOpen(true)
  const closeConfirmDelete = () => setConfirmOpen(false)

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds)
    for (const id of ids) {
      const it = items.find(x => x.id === id)
      if (!it) continue
      try { await deleteObject(ref(storage, it.path)) } catch {}
      try { await deleteDoc(doc(db, 'storageItems', id)) } catch {}
    }
    setSelectedIds(new Set())
    setConfirmOpen(false)
  }

  const filteredItems = items.filter(it => {
    if (search && !it.displayName.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all') {
      const ct = it.contentType || ''
      if (typeFilter === 'image' && !ct.startsWith('image')) return false
      if (typeFilter === 'video' && !ct.startsWith('video')) return false
      if (typeFilter === 'audio' && !ct.startsWith('audio')) return false
    }
    if (dateFrom) {
      const fromMs = new Date(dateFrom).getTime()
      if ((it.createdAtMs || 0) < fromMs) return false
    }
    if (dateTo) {
      const toMs = new Date(dateTo).getTime() + 24*60*60*1000 - 1
      if ((it.createdAtMs || 0) > toMs) return false
    }
    return true
  })

  return (
    <div className="page-container min-h-screen overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-dancing font-bold text-purple-700">Kho lưu trữ (Anh chưa làm xong hihi)</h1>
          <p className="text-gray-600 mt-2">Tải ảnh/video hoặc ghi âm, kèm ghi chú để lưu giữ kỷ niệm.</p>
        </motion.div>

        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="space-y-3 md:col-span-2">
              <input type="file" accept="image/*,video/*,audio/*" onChange={onSelectFile} />
              <div className="flex gap-2">
                {!recording ? (
                  <Button variant="outlined" onClick={startRecording}>🎙️ Bắt đầu ghi âm</Button>
                ) : (
                  <Button variant="contained" color="error" onClick={stopRecording}>⏹️ Dừng ghi</Button>
                )}
                <Button variant="contained" disabled={!file || uploading} onClick={handleUpload}>
                  {uploading ? 'Đang tải lên...' : 'Tải lên'}
                </Button>
              </div>
              <div className="text-xs text-gray-600">Kéo & thả nhiều tệp vào vùng này để tải lên nhanh.</div>
              {progress !== null && (
                <div className="pt-1">
                  <LinearProgress variant="determinate" value={progress} />
                </div>
              )}
              <TextField
                label="Ghi chú"
                fullWidth
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: 'white' } }}
              />
            </div>
            <div className="text-sm text-gray-700">
              <div>Đã lưu: <span className="font-semibold">{items.length}</span> mục</div>
              <div className="text-xs text-gray-500 mt-1">Mỗi lần lưu, danh sách bên dưới sẽ cập nhật. Nhấn vào để mở xem.</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/70 backdrop-blur rounded-2xl p-4 shadow">
          <div className="grid md:grid-cols-4 gap-3 items-end">
            <TextField label="Tìm theo tên" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
            <div>
              <InputLabel id="type-select-label">Loại</InputLabel>
              <Select labelId="type-select-label" value={typeFilter} size="small" onChange={(e) => setTypeFilter(e.target.value as any)} fullWidth>
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="image">Ảnh</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Âm thanh</MenuItem>
              </Select>
            </div>
            <TextField label="Từ ngày" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Đến ngày" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button variant="outlined" onClick={selectAll}>Chọn tất cả</Button>
            <Button variant="outlined" onClick={clearSelection}>Bỏ chọn</Button>
            <Button variant="contained" color="error" disabled={selectedIds.size === 0} onClick={openConfirmDelete}>Xoá mục đã chọn ({selectedIds.size})</Button>
          </div>
        </div>

        <div className="mt-4">
          <Grid container spacing={2}>
            {filteredItems.map((it) => (
              <Grid item xs={12} sm={6} md={4} key={it.id}>
                <Card className="rounded-2xl overflow-hidden shadow">
                  <div className="absolute z-10 p-2">
                    <Checkbox checked={selectedIds.has(it.id)} onChange={() => toggleSelect(it.id)} />
                  </div>
                  {it.contentType && it.contentType.startsWith('video') ? (
                    <CardMedia component="video" controls src={it.url} sx={{ height: 220 }} />
                  ) : it.contentType && it.contentType.startsWith('audio') ? (
                    <CardContent>
                      <audio controls className="w-full">
                        <source src={it.url} />
                      </audio>
                    </CardContent>
                  ) : (
                    <CardMedia component="img" image={it.url} sx={{ height: 220, objectFit: 'cover' }} />
                  )}
                  <CardContent>
                    {editId === it.id ? (
                      <div className="flex items-center gap-2">
                        <TextField size="small" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <IconButton onClick={handleSaveRename}><Save size={18} /></IconButton>
                        <IconButton onClick={handleCancelRename}><X size={18} /></IconButton>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-gray-800 break-words">{it.displayName}</div>
                    )}
                    {editNoteId === it.id ? (
                      <div className="flex items-start gap-2 mt-2">
                        <TextField size="small" multiline minRows={2} value={editNote} onChange={(e) => setEditNote(e.target.value)} fullWidth />
                        <div className="flex flex-col">
                          <IconButton onClick={handleSaveNote}><Save size={18} /></IconButton>
                          <IconButton onClick={handleCancelNote}><X size={18} /></IconButton>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 mt-1 break-words">{it.note || '—'}</div>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => window.open(it.url, '_blank')}><ExternalLink size={18} /></IconButton>
                    <IconButton onClick={() => handleStartRename(it)}><Edit size={18} /></IconButton>
                    <IconButton onClick={() => handleStartEditNote(it)}><Save size={18} /></IconButton>
                    <IconButton onClick={() => handleDelete(it.id, it.path)}><Trash2 size={18} /></IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        <Dialog open={confirmOpen} onClose={closeConfirmDelete} maxWidth="xs" fullWidth>
          <DialogTitle>Xác nhận xoá</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xoá {selectedIds.size} mục đã chọn? Hành động này không thể hoàn tác.
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDelete}>Huỷ</Button>
            <Button color="error" variant="contained" onClick={handleBatchDelete}>Xoá</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default StoragePage
