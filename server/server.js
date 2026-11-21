// SIKAP Sync Server — simple demo backend
// Run: npm install express cors && node server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB = './sikap-data.json';

app.use(cors());
app.use(express.json());

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch(e){ return []; }
}
function save(data){ fs.writeFileSync(DB, JSON.stringify(data,null,2)); }

app.get('/api/health', (req,res)=>res.json({ok:true, service:'SIKAP Sync'}));

app.post('/api/sync', (req,res)=>{
  const body = req.body || {};
  if(!body.student) return res.status(400).json({error:'student is required'});

  const data = load();
  const record = {...body, updatedAt:new Date().toISOString()};
  const idx = data.findIndex(x=>x.student.toLowerCase()===body.student.toLowerCase());
  if(idx >= 0) data[idx] = record;
  else data.push(record);
  save(data);
  res.json({ok:true, record});
});

app.get('/api/students', (req,res)=>res.json(load()));

app.listen(PORT, ()=>console.log(`SIKAP Sync Server running on port ${PORT}`));
