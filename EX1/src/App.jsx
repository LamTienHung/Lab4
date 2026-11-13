import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}