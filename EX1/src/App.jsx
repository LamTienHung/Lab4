import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { PEOPLE } from './data/people.js';
import { Layout } from './components/Layout.jsx';
import { Skeleton } from './components/Skeleton.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { PeopleIndex } from './pages/PeopleIndex.jsx';

// Code-splitting: mỗi trang lazy là 1 chunk JS riêng, chỉ tải khi vào route
const About = lazy(() => import('./pages/About.jsx'));
const PeopleLayout = lazy(() => import('./pages/PeopleLayout.jsx'));
const PersonDetail = lazy(() => import('./pages/PersonDetail.jsx'));
const SimpleForm = lazy(() => import('./pages/SimpleForm.jsx'));
const ForumPage = lazy(() => import('./pages/ForumPage.jsx'));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="about"
          element={
            <Suspense fallback={<Skeleton variant="page" />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="people"
          element={
            <Suspense fallback={<Skeleton variant="directory" />}>
              <PeopleLayout people={PEOPLE} />
            </Suspense>
          }
        >
          <Route index element={<PeopleIndex />} />
          <Route
            path=":id"
            element={
              <Suspense fallback={<Skeleton variant="detail" />}>
                <PersonDetail people={PEOPLE} />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="form"
          element={
            <Suspense fallback={<Skeleton variant="form" />}>
              <SimpleForm />
            </Suspense>
          }
        />
        <Route path="forum" element={<Navigate to="/forum/nasa" replace />} />
        <Route
          path="forum/:channel"
          element={
            <Suspense fallback={<Skeleton variant="forum" />}>
              <ForumPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}