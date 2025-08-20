import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 컨테이너 외부 접속 허용
    port: 5173,
    //proxy: {
      //'/api': {
       // target: 'http://192.168.18.120:5000', // 실제 백엔드 서버 주소
       // changeOrigin: true,
        // 필요에 따라 경로를 다시 작성할 수 있습니다.
        // rewrite: (path) => path.replace(/^\/api/, ''),
    //  }
  //  }
}
})