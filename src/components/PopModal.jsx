import { useState, useEffect } from 'react';
import styles from './PopModal.module.css';

const PopModal = ({ isOpen, onClose, food, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isVeg: true,
    isAvailable: true,
    image: '',
    units: [{ name: 'Full Plate', price: '' }],
    ingredients: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        description: food.description || '',
        isVeg: food.isVeg ?? true,
        isAvailable: food.isAvailable ?? true,
        image: food.image || '',
        units: food.units || [{ name: 'Full Plate', price: '' }],
        ingredients: food.ingredients || ''
      });
      setImagePreview(food.image || null);
    }
  }, [food]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUnitPriceChange = (index, value) => {
    const newUnits = [...formData.units];
    newUnits[index].price = value;
    setFormData(prev => ({ ...prev, units: newUnits }));
  };

  const handleUnitNameChange = (index, value) => {
    const newUnits = [...formData.units];
    newUnits[index].name = value;
    setFormData(prev => ({ ...prev, units: newUnits }));
  };

  const addUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, { name: '', price: '' }]
    }));
  };

  const removeUnit = (index) => {
    if (formData.units.length > 1) {
      const newUnits = formData.units.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, units: newUnits }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...food, ...formData });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Food Item</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label htmlFor="modal-name" className={styles.label}>
              Item Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter item name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="modal-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter description"
              rows="3"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-ingredients" className={styles.label}>
              Ingredients
            </label>
            <textarea
              id="modal-ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="Enter ingredients (comma separated)"
              rows="3"
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
                  name="isVeg"
                  checked={formData.isVeg === true}
                  onChange={() => setFormData(prev => ({ ...prev, isVeg: true }))}
                  className={styles.radio}
                />
                <span className={styles.vegIndicator}>🟢 Vegetarian</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="isVeg"
                  checked={formData.isVeg === false}
                  onChange={() => setFormData(prev => ({ ...prev, isVeg: false }))}
                  className={styles.radio}
                />
                <span className={styles.nonVegIndicator}>🔴 Non-Vegetarian</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.unitsHeader}>
              <label className={styles.label}>
                Units & Pricing <span className={styles.required}>*</span>
              </label>
              <button type="button" onClick={addUnit} className={styles.addUnitButton}>
                + Add Unit
              </button>
            </div>
            <div className={styles.unitsContainer}>
              {formData.units.map((unit, index) => (
                <div key={index} className={styles.unitRow}>
                  <input
                    type="text"
                    value={unit.name}
                    onChange={(e) => handleUnitNameChange(index, e.target.value)}
                    placeholder="Unit name"
                    required
                    className={styles.unitInput}
                  />
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      value={unit.price}
                      onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                      placeholder="Price"
                      required
                      min="0"
                      className={styles.priceInput}
                    />
                  </div>
                  {formData.units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-image" className={styles.label}>
              Food Image
            </label>
            <input
              type="file"
              id="modal-image"
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
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Mark as available
            </label>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" onClick={handleSubmit} className={styles.submitButton}>
            Save Changes
          </button>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopModal;