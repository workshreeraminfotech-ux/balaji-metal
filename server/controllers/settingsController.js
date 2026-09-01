const { pool } = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [settings] = await pool.query('SELECT setting_key, setting_value FROM website_settings');
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.setting_key] = s.setting_value;
    });
    res.status(200).json({ success: true, data: settingsObj });
  } catch (error) {
    next(error);
  }
};

exports.getByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const [settings] = await pool.query('SELECT setting_value FROM website_settings WHERE setting_key = ?', [key]);
    
    if (settings.length === 0) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    
    res.status(200).json({ success: true, data: settings[0].setting_value });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    // Accept either a raw array [{key, value}] / [{setting_key, setting_value}],
    // or that array wrapped in { settings: [...] }, so the endpoint doesn't
    // silently no-op if the client shape drifts.
    const body = req.body;
    const settingsArray = Array.isArray(body) ? body : (Array.isArray(body?.settings) ? body.settings : null);

    if (!settingsArray) {
      return res.status(400).json({ success: false, message: 'Expected an array of {key, value} settings' });
    }

    for (let setting of settingsArray) {
      const key = setting.key ?? setting.setting_key;
      const value = setting.value ?? setting.setting_value;
      if (!key) continue;
      await pool.query(
        'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    
    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
