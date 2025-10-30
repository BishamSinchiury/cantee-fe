import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ currentPage, onNavigate, onLogout, user }) => {
  const navigate = useNavigate()
  const handleNavClick = (page, e) => {
    e.preventDefault();
    onNavigate(page);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>🍽️</span>
          <span className={styles.brandName}>Food Manager</span>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <a 
              href="/" 
              onClick={() => navigate('/')}
              className={currentPage === 'food-list' ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              All Foods
            </a>
          </li>
          <li>
            <a 
              href="/today" 
              onClick={() => navigate('today')}
              className={currentPage === 'available-today' ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Available Today
            </a>
          </li>
          <li>
            <a 
              href="/transactions" 
              onClick={(e) => handleNavClick('transactions', e)}
              className={currentPage === 'transactions' ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              📊 Transactions
            </a>
          </li>
          <li>
            <a 
              href="/add-food" 
              onClick={(e) => handleNavClick('add-food', e)}
              className={currentPage === 'add-food' ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              <span className={styles.addIcon}>+</span>
              Add Food
            </a>
          </li>
        </ul>

        <div className={styles.userSection}>
          {user && (
            <span className={styles.username}>
              👤 {user.username}
            </span>
          )}
          <button 
            onClick={handleLogoutClick}
            className={styles.logoutButton}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;