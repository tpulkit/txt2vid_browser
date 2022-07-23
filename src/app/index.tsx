import { useEffect, useState, useRef } from 'react';
import { ThemeProvider, RMWCProvider, DialogQueue, Theme } from 'rmwc';
import '@rmwc/theme/styles';
import '@rmwc/button/styles';
import '@rmwc/tabs/styles';
import '@rmwc/textfield/styles';
import '@rmwc/dialog/styles';
import '@rmwc/icon/styles';
import '@rmwc/select/styles';
import '@rmwc/checkbox/styles';
import '@rmwc/circular-progress/styles';
import '@rmwc/tooltip/styles';
import '@rmwc/typography/styles';
import '@rmwc/radio/styles';
import { lightTheme, darkTheme, dialogs, useGlobalState, mlInit, alert, themePreference } from '../util';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Call, StartCall } from '../pages';
import Settings from './settings';
import Loading from './loading';
import './index.css';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useGlobalState('showSettings');
  const [darkMode, setDarkMode] = useGlobalState('darkMode');
  const [ttsID] = useGlobalState('ttsID');
  useEffect(() => {
    mlInit.then(() => setLoaded(true));
    const tcb = themePreference.on('darkMode', setDarkMode);
    return () => themePreference.off('darkMode', tcb);
  }, []);
  useEffect(() => {
    if (loaded && !ttsID) {
      alert({
        title: <Theme use="onSurface">Welcome to Txt2Vid!</Theme>,
        body: <Theme use="onSurface">This is a demo of the Txt2Vid platform. Please configure your resemble.ai credentials and username on the settings page to start.</Theme>,
        preventOutsideDismiss: true
      }).then(() => {
        setShowSettings(true);
      });
    }
  }, [loaded, ttsID]);
  return (
    <ThemeProvider options={darkMode ? darkTheme : lightTheme} theme={['background', 'textPrimaryOnBackground']} style={{
      minHeight: '100vh'
    }}>
      <RMWCProvider tooltip={{ showArrow: true }}>
        <DialogQueue dialogs={dialogs} />
        {loaded ? <BrowserRouter>
          <Settings open={showSettings} onClose={() => setShowSettings(false)} />
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="call">
                <Route index element={<StartCall />} />
                <Route path=":roomID" element={<Call />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter> : <Loading />}
      </RMWCProvider>
    </ThemeProvider>
  );
};

export default App;
