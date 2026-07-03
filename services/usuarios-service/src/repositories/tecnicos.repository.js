const supabase = require('../config/supabase');

const findAll = async () => {
  return supabase
    .from('tecnicos')
    .select('*');
};

const findById = async (id) => {
  return supabase
    .from('tecnicos')
    .select('*')
    .eq('id', id)
    .single();
};

const findByNombre = async (nombre) => {
  return supabase
    .from('tecnicos')
    .select('*')
    .eq('nombre', nombre)
    .single();
};

const updateTareasActuales = async (id, tareasActuales) => {
  return supabase
    .from('tecnicos')
    .update({ tareas_actuales: tareasActuales })
    .eq('id', id);
};

module.exports = {
  findAll,
  findById,
  findByNombre,
  updateTareasActuales,
};
