import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import styles from './AvailableToday.module.css';
import Navbar from '../components/Navbar';

const AvailableToday = () => {
  const [foods, setFoods] = useState([]);
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

  const handleOrder = (food, unit, price) => {
    // Generate a simple token (timestamp + random number)
    const token = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    console.log('Order Token:', token);
    console.log('Order Details:', { food: food.name, unit, price });
    
    showNotification(
      `Order placed successfully! Token: ${token}`,
      'success'
    );
    
    // Also show alert for token
    setTimeout(() => {
      alert(`Order placed successfully!\n\nToken: ${token}\nItem: ${food.name}\nUnit: ${unit}\nPrice: ₹${price}\n\nPlease save your token for order tracking.`);
    }, 100);
  };

  const handleViewIngredients = (food) => {
    const ingredients = food.ingredients || 'No ingredients listed';
    alert(`Ingredients for ${food.name}:\n\n${ingredients}`);
  };

  // Filter items based on isAvailable
  const availableTodayItems = foods.filter(food => food.isAvailable === true);
  const otherItems = foods.filter(food => food.isAvailable === false);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error loading menu items. Please try again.</p>
          <button onClick={fetchFoods} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className={styles.title}>Available Today</h1>
        <p className={styles.subtitle}>Order from today's special menu</p>
      </div>

      {/* Featured Section - Available Today */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.badge}>{availableTodayItems.length}</span>
            Items Available Today
          </h2>
        </div>

        {availableTodayItems.length > 0 ? (
          <div className={styles.grid}>
            {availableTodayItems.map(food => (
              <div key={food.id} className={styles.cardWrapper}>
                <FoodCard
                  food={food}
                  onOrder={handleOrder}
                  onViewIngredients={handleViewIngredients}
                  showOrderButton={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No items marked as available today</p>
            <p className={styles.emptySubtext}>Check back later for updates</p>
          </div>
        )}
      </section>

    </div>
    </>
  );
};

export default AvailableToday;