import { useState } from 'react';
import styles from './AddFood.module.css';

const AddFood = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    veg: true,
    unit: 'Full Plate',
    price: '',
    image: null,
    is_available: true
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('veg', formData.veg);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('is_available', formData.is_available);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://127.0.0.1:8000/items/items/', {
        method: 'POST',
        body: formDataToSend,
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text.substring(0, 200) };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.detail || data.error || 'Failed to add food item';
        throw new Error(errorMessage);
      }
      console.log('Food item added:', data);
      showNotification('Food item added successfully!', 'success');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        veg: true,
        unit: 'Full Plate',
        price: '',
        image: null,
        is_available: true
      });
      setImagePreview(null);
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error adding food item:', err);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <span className={styles.notificationIcon}>
            {notification.type === 'success' ? '✓' : '✕'}
          </span>
          <span className={styles.notificationMessage}>{notification.message}</span>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Add New Food Item</h1>
        <p className={styles.subtitle}>Fill in the details to add a new item to the menu</p>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Item Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter item name"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a brief description"
            rows="4"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Food Type <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="veg"
                checked={formData.veg === true}
                onChange={() => setFormData(prev => ({ ...prev, veg: true }))}
                className={styles.radio}
              />
              <span className={styles.vegIndicator}>🟢 Vegetarian</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="veg"
                checked={formData.veg === false}
                onChange={() => setFormData(prev => ({ ...prev, veg: false }))}
                className={styles.radio}
              />
              <span className={styles.nonVegIndicator}>🔴 Non-Vegetarian</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="unit" className={styles.label}>
            Unit <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
            placeholder="e.g., Full Plate, Half Plate, Piece"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Price (₹) <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            Food Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" className={styles.previewImage} />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            Mark as available
          </label>
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Food Item'}
          </button>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFood;