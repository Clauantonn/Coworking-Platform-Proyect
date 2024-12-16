import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '/styles/General.css';
import '/styles/Home.css';
import '/styles/Header.css';
import '/styles/LoginPage.css';
import '/styles/Footer.css';
import '/styles/RegisterPage.css';
import '/styles/Main.css';
import '/styles/UserProfilePage.css';
import '/styles/RecoverPass.css';
import '/styles/NotFound.css';
import '/styles/AddOfficeAdminPage.css';
import '/styles/BookingListPage.css';
import '/styles/BookingDetailsPage.css';
import '/styles/BookAnOfficePage.css';
import '/styles/OfficeDetails.css';
import '/styles/CarruselFotosOfi.css';
import '/styles/OfficeListPage.css';
import "/styles/ActivateUserPage.css";

// Importamos los componentes

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import ActivateUserPage from './pages/ActivateuserPage';
import BookingsListPage from './pages/BookingsListPage';

import AddOfficeAdminPage from './pages/AddOfficeAdminPage';
import OfficeDetailsPage from './pages/OfficeDetailsPage';
import BookAnOfficePage from './pages/BookAnOfficePage';
import RecoverPassPage from './pages/RecoverPassPage';
import ResetPassPage from './pages/ResetPassPage';
import OfficeListPage from './pages/OfficesListPage';
import EditOfficePage from './pages/EditOfficePage';

const App = () => {
  return (
    <>
      <Header />
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 5000,
        }}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/users/bookings/:idBooking'
          element={<BookingDetailsPage />}
        />
        <Route path='/booking/list' element={<BookingsListPage />} />
        <Route path='/office/create' element={<AddOfficeAdminPage />} />
        <Route path='/users/profile' element={<UserProfilePage />} />
        <Route path='/office/list' element={<OfficeListPage />} />
        <Route
          path='/users/activate/:registrationCode'
          element={<ActivateUserPage />}
        />
        <Route path='office/edit/:idOffice' element={<EditOfficePage />} />
        <Route path='/booking/:idOffice' element={<BookAnOfficePage />} />
        <Route
          path='/office/details/:idOffice'
          element={<OfficeDetailsPage />}
        />
        <Route path='/users/password/recover' element={<RecoverPassPage />} />
        <Route
          path='/users/password/reset/:recoverPassCode'
          element={<ResetPassPage />}
        />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
