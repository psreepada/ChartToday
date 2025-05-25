// Express server for MediRecord backend
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client setup (using provided credentials)
const SUPABASE_URL = 'https://amvchljybbzajsbviaqw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdmNobGp5YmJ6YWpzYnZpYXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTEwMzYsImV4cCI6MjA2MTY4NzAzNn0.JXASeZIrehUVm9O0VaK6d3AAaX_4CepTfZiZ4wVqR7U';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- PATIENTS ---
// Get all patients
app.get('/patients', async (req, res) => {
  const { data, error } = await supabase.from('patients').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get a single patient by ID
app.get('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Patient not found' });
  res.json(data);
});

// Create a new patient
app.post('/patients', async (req, res) => {
  const patient = req.body;
  const { data, error } = await supabase.from('patients').insert([patient]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update a patient
app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete a patient
app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('patients').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- EMERGENCY CONTACTS ---
app.get('/patients/:id/emergency-contacts', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('emergency_contacts').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/emergency-contacts', async (req, res) => {
  const { id } = req.params;
  const contact = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('emergency_contacts').insert([contact]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/patients/:id/emergency-contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('emergency_contacts').update(updates).eq('id', contactId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/patients/:id/emergency-contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const { error } = await supabase.from('emergency_contacts').delete().eq('id', contactId);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- VITAL STATS ---
app.get('/patients/:id/vital-stats', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('vital_stats').select('*').eq('patient_id', id).order('recorded_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/vital-stats', async (req, res) => {
  const { id } = req.params;
  const vital = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('vital_stats').insert([vital]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- APPOINTMENTS (per patient) ---
app.get('/patients/:id/appointments', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('appointments').select('*').eq('patient_id', id).order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/appointments', async (req, res) => {
  const { id } = req.params;
  const appointment = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('appointments').insert([appointment]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/patients/:id/appointments/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('appointments').update(updates).eq('id', appointmentId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/patients/:id/appointments/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- MEDICAL HISTORY (per patient) ---
app.get('/patients/:id/medical-history', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('medical_history').select('*').eq('patient_id', id).single();
  if (error) return res.status(404).json({ error: 'Medical history not found' });
  res.json(data);
});

app.put('/patients/:id/medical-history', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('medical_history').update(updates).eq('patient_id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/medical-history', async (req, res) => {
  const { id } = req.params;
  const history = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('medical_history').insert([history]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- MEDICATIONS (per patient) ---
app.get('/patients/:id/medications', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('medications').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/medications', async (req, res) => {
  const { id } = req.params;
  const medication = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('medications').insert([medication]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/patients/:id/medications/:medicationId', async (req, res) => {
  const { medicationId } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('medications').update(updates).eq('id', medicationId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/patients/:id/medications/:medicationId', async (req, res) => {
  const { medicationId } = req.params;
  const { error } = await supabase.from('medications').delete().eq('id', medicationId);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- MEDICATION HISTORY (per patient) ---
app.get('/patients/:id/medication-history', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('medication_history').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/medication-history', async (req, res) => {
  const { id } = req.params;
  const medHistory = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('medication_history').insert([medHistory]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- LAB RESULTS (per patient) ---
app.get('/patients/:id/lab-results', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('lab_results').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/lab-results', async (req, res) => {
  const { id } = req.params;
  const labResult = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('lab_results').insert([labResult]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- NOTES (per patient) ---
app.get('/patients/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('notes').select('*').eq('patient_id', id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/notes', async (req, res) => {
  const { id } = req.params;
  const note = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('notes').insert([note]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- HEALTH TRENDS (per patient) ---
app.get('/patients/:id/health-trends', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('health_trends').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/health-trends', async (req, res) => {
  const { id } = req.params;
  const trend = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('health_trends').insert([trend]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- MEDICAL RECORDS (per patient) ---
app.get('/patients/:id/medical-records', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('medical_records').select('*').eq('patient_id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/patients/:id/medical-records', async (req, res) => {
  const { id } = req.params;
  const record = { ...req.body, patient_id: id };
  const { data, error } = await supabase.from('medical_records').insert([record]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- ROOT ---
app.get('/', (req, res) => {
  res.send('MediRecord Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
