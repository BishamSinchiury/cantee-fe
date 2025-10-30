import { useState } from 'react';
import styles from './FoodCard.module.css';

const FoodCard = ({ food, onEdit, onOrder, onViewIngredients, showOrderButton = false }) => {
  const [selectedUnit, setSelectedUnit] = useState(food.units[0].name);

  const currentPrice = food.units.find(unit => unit.name === selectedUnit)?.price || 0;

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleActionClick = () => {
    if (showOrderButton && onOrder) {
      onOrder(food, selectedUnit, currentPrice);
    } else if (onEdit) {
      onEdit(food);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={food.image} alt={food.name} className={styles.image} />
        <span className={`${styles.vegIndicator} ${food.isVeg ? styles.veg : styles.nonVeg}`}>
          {food.isVeg ? '🟢' : '🔴'}
        </span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{food.name}</h3>
          <span className={`${styles.availability} ${food.isAvailable ? styles.available : styles.unavailable}`}>
            {food.isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
        
        <p className={styles.description}>{food.description}</p>
        
        <div className={styles.priceSection}>
          <div className={styles.unitSelector}>
            <label htmlFor={`unit-${food.id}`} className={styles.label}>Unit:</label>
            <select 
              id={`unit-${food.id}`}
              value={selectedUnit} 
              onChange={handleUnitChange}
              className={styles.select}
            >
              {food.units.map(unit => (
                <option key={unit.name} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.price}>₹{currentPrice}</div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${showOrderButton ? styles.orderButton : styles.editButton}`}
            onClick={handleActionClick}
          >
            {showOrderButton ? 'Order Now' : 'Edit'}
          </button>
          <button 
            className={`${styles.button} ${styles.ingredientsButton}`}
            onClick={() => onViewIngredients && onViewIngredients(food)}
          >
            View Ingredients
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;