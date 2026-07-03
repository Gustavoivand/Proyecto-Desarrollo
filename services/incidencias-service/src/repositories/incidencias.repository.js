const supabase = require('../config/supabase');

const findAll = async () => {
  return supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .order('fecha_hora', { ascending: false });
};

const findById = async (id) => {
  return supabase
    .from('incidencias')
    .select('*, historial:historial_incidencias(*)')
    .eq('id', id)
    .single();
};

const findBaseById = async (id) => {
  return supabase
    .from('incidencias')
    .select('*')
    .eq('id', id)
    .single();
};

const createIncidencia = async (incidencia) => {
  return supabase
    .from('incidencias')
    .insert([incidencia])
    .select()
    .single();
};

const updateIncidencia = async (id, updateFields) => {
  return supabase
    .from('incidencias')
    .update(updateFields)
    .eq('id', id);
};

const createHistorialEvento = async (evento) => {
  return supabase
    .from('historial_incidencias')
    .insert([evento]);
};

const createHistorialEventos = async (eventos) => {
  return supabase
    .from('historial_incidencias')
    .insert(eventos);
};

module.exports = {
  findAll,
  findById,
  findBaseById,
  createIncidencia,
  updateIncidencia,
  createHistorialEvento,
  createHistorialEventos,
};
