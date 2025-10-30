import FoodList from './pages/FoodList';
import AddFood from './pages/AddFood';
import AvailableToday from './pages/AvailableToday';
/**
 * Application routes configuration
 * Each route object contains:
 * - path: URL path for the route
 * - component: Component to render
 * - name: Display name for navigation
 * - icon: Optional icon/emoji for UI
 */
const routes = [
  {
    path: '/',
    component: FoodList,
    name: 'All Foods',
    key: 'food-list',
    icon: '🍽️'
  },
  {
    path: '/available-today',
    component: AvailableToday,
    name: 'Available Today',
    key: 'available-today',
    icon: '✅'
  },
  {
    path: '/add-food',
    component: AddFood,
    name: 'Add Food',
    key: 'add-food',
    icon: '➕'
  }
];

export default routes;