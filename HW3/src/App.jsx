import FairPlayAppealPortal, { PortalOverview } from './pages/FairPlayAppealPortal.jsx';
import DossierView from './pages/DossierView.jsx';
import NotFound from './pages/NotFound.jsx';

export const routes = [
  {
    path: '/',
    element: <FairPlayAppealPortal />,
    errorElement: (
      <NotFound
        title="Đã xảy ra lỗi"
        message="Trang gặp sự cố khi hiển thị. Vui lòng thử lại."
      />
    ),
    children: [
      { index: true, element: <PortalOverview /> },
      { path: 'dossier/:playerID', element: <DossierView /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];