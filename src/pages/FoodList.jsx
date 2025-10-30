import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import PopModal from '../components/PopModal';
import styles from './FoodList.module.css';
import Navbar from '@/components/Navbar';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/items/items/');
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch food items');
      }

      // Transform API data to match component structure
      const transformedData = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        image: item.image || '',
        isVeg: item.veg,
        isAvailable: item.is_available,
        ingredients: item.ingredients || '',
        units: [{ name: item.unit, price: item.price }]
      }));

      setFoods(transformedData);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError(err.message);
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedFood) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', updatedFood.name);
      formDataToSend.append('description', updatedFood.description);
      formDataToSend.append('veg', updatedFood.isVeg);
      formDataToSend.append('unit', updatedFood.units[0].name);
      formDataToSend.append('price', parseFloat(updatedFood.units[0].price));
      formDataToSend.append('is_available', updatedFood.isAvailable);
      
      if (updatedFood.image && typeof updatedFood.image !== 'string') {
        formDataToSend.append('image', updatedFood.image);
      }

      const response = await fetch(`http://127.0.0.1:8000/items/items/${updatedFood.id}/`, {
        method: 'PUT',
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
        const errorMessage = data.message || data.detail || data.error || 'Failed to update food item';
        throw new Error(errorMessage);
      }

      // Update local state
      setFoods(foods.map(f => f.id === updatedFood.id ? updatedFood : f));
      showNotification('Food item updated successfully!', 'success');
      console.log('Food updated:', data);
    } catch (err) {
      console.error('Error updating food:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleViewIngredients = (food) => {
    const ingredients = food.ingredients || 'No ingredients listed';
    alert(`Ingredients for ${food.name}:\n\n${ingredients}`);
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVeg = vegFilter === 'all' || 
                       (vegFilter === 'veg' && food.isVeg) ||
                       (vegFilter === 'nonveg' && !food.isVeg);
    
    const matchesAvailability = availabilityFilter === 'all' || 
                                (availabilityFilter === 'available' && food.isAvailable);
    
    return matchesSearch && matchesVeg && matchesAvailability;
  });

  return (
    <>
    <Navbar />
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
        <h1 className={styles.title}>Food Menu</h1>
        <p className={styles.subtitle}>Browse our delicious collection</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Type:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="all"
                  checked={vegFilter === 'all'}
                  onChange={(e) => setVegFilter(e.target.value)}
                  className={styles.radio}
                />
                All
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="veg"
                  checked={vegFilter === 'veg'}
                  onChange={(e) => setVegFilter(e.target.value)}
                  className={styles.radio}
                />
                Veg
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="nonveg"
                  checked={vegFilter === 'nonveg'}
                  onChange={(e) => setVegFilter(e.target.value)}
                  className={styles.radio}
                />
                Non-Veg
              </label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Availability:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="all"
                  checked={availabilityFilter === 'all'}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className={styles.radio}
                />
                All
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="available"
                  checked={availabilityFilter === 'available'}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className={styles.radio}
                />
                Available Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading food items...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>Error loading food items. Please try again.</p>
          <button onClick={fetchFoods} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className={styles.results}>
            <p className={styles.resultCount}>
              {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          <div className={styles.grid}>
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onEdit={handleEdit}
                  onViewIngredients={handleViewIngredients}
                  showOrderButton={false}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No items found matching your criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      <PopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        food={selectedFood}
        onSave={handleSave}
      />
    </div>
    </>
  );
};

export default FoodList;