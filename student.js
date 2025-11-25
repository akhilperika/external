const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


let students = [];
let nextId = 1;

app.get('/students', (req, res) => {
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const s = students.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

app.post('/students', (req, res) => {
  const { name, age, major } = req.body;
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid or missing name' });
  if (age === undefined || typeof age !== 'number') return res.status(400).json({ error: 'Invalid or missing age' });
  if (!major || typeof major !== 'string') return res.status(400).json({ error: 'Invalid or missing major' });

  const student = { id: nextId++, name, age, major, createdAt: new Date().toISOString() };
  students.push(student);
  res.status(201).json(student);
});

app.patch('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const s = students.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'Student not found' });

  const { name, age, major } = req.body;
  if (name !== undefined) {
    if (typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
    s.name = name;
  }
  if (age !== undefined) {
    if (typeof age !== 'number') return res.status(400).json({ error: 'Invalid age' });
    s.age = age;
  }
  if (major !== undefined) {
    if (typeof major !== 'string') return res.status(400).json({ error: 'Invalid major' });
    s.major = major;
  }
  res.json(s);
});

app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = students.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  const removed = students.splice(idx, 1)[0];
  res.json({ message: 'Deleted', student: removed });
});

app.get('/', (req, res) => res.send('Student API (Node) running'));

app.listen(port, () => console.log(`Node Student API listening on http://localhost:${port}`));
