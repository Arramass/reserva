import AsyncStorage from '@react-native-async-storage/async-storage';

// Veri kaydetme
export const setStorageData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Storage set error:', error);
    throw error;
  }
};

// Veri okuma
export const getStorageData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Storage get error:', error);
    throw error;
  }
};

// Veri silme
export const removeStorageData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Storage remove error:', error);
    throw error;
  }
};

// Tüm verileri temizleme
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Storage clear error:', error);
    throw error;
  }
};
