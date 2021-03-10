import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  
  //renderiza componentes que estarão disponiveis em todas as telas
  return (
    
    <Component {...pageProps} />
  )
}

export default MyApp
