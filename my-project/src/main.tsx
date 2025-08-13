import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // 테일윈드 CSS를 위한 파일, 다음 단계에서 생성

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)