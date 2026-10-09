import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Layout } from './Layout';
import { Index } from '../sections/Index';
import { Substrate } from '../sections/Substrate';
import { Waypoints } from '../sections/Waypoints';
import { FieldNotes } from '../sections/FieldNotes';
import { Legend } from '../sections/Legend';
import { Erevan } from '../sections/Erevan';
import { OffRoute } from '../sections/OffRoute';
import { Transmit } from '../sections/Transmit';
import { NotFound } from '../sections/NotFound';
import { CaseStudy } from '../sections/CaseStudy';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="substrate" element={<Substrate />} />
            <Route path="waypoints" element={<Waypoints />} />
            <Route path="fieldnotes" element={<FieldNotes />} />
            <Route path="legend" element={<Legend />} />
            <Route path="erevan" element={<Erevan />} />
            <Route path="offroute" element={<OffRoute />} />
            <Route path="transmit" element={<Transmit />} />
            <Route path="work/:slug" element={<CaseStudy />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}