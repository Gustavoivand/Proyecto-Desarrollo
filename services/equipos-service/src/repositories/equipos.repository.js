const supabase = require('../config/supabase');

const findAll = async () => {
  return supabase
    .from('equipos')
    .select('*')
    .order('codigo', { ascending: true });
};

const findByCodigo = async (codigo) => {
  return supabase
    .from('equipos')
    .select('*')
    .eq('codigo', codigo)
    .single();
};

module.exports = {
  findAll,
  findByCodigo,
};
