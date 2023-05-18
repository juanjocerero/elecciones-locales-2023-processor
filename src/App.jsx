import { useState } from 'react'
import { useCSVReader, useCSVDownloader } from 'react-papaparse'

import './App.css'

function App() {
  
  const { CSVReader } = useCSVReader()
  const { CSVDownloader, Type } = useCSVDownloader()
  
  const [paginaPueblosData, setPaginasPueblosData] = useState()
  const [masVotadosData, setMasVotadosData] = useState()
  const [dataByParty, setDataByParty] = useState()
  
  const handlePaginaPueblos = data => {
    const municipiosObjects = data.map(row => {
      return {
        municipio: row[6]?.trim(),
        porcentajeVotantes: row[14] ? (Number(row[14]?.toString().replace(',','.')).toString().replace('.',',')) : null,
        uno: row[23]?.trim(),
        unoConcejales: Number(row[26]) !== 0 ? Number(row[26]) : null,
        dos: row[28]?.trim(),
        dosConcejales: Number(row[31]) !== 0 ? Number(row[31]) : null,
        tres: row[33]?.trim(),
        tresConcejales: Number(row[36]) !== 0 ? Number(row[31]) : null,
        cuatro: row[38]?.trim(),
        cuatroConcejales: Number(row[41]) !== 0 ? Number(row[41]) : null,
        cinco: row[43]?.trim(),
        cincoConcejales: Number(row[46]) !== 0 ? Number(row[46]) : null,
        seis: row[48]?.trim(),
        seisConcejales: Number(row[51]) !== 0 ? Number(row[51]) : null
      }
    })

    // console.log(municipiosObjects)
    
    setPaginasPueblosData(municipiosObjects)
  }
  
  const handleMasVotados = data => {
    const masVotados = data.map(row => {
      return {
        municipio: row[6]?.trim(),
        masVotado: row[23]?.trim(),
        porcentajeVoto: Number(row[25]?.toString().replace(',','.')).toString().replace('.',','),
        concejales: Number(row[26])
      }
    })
    
    setMasVotadosData(masVotados)
  }
  
  const handleOrderedByParty = data => {

    const byParty = []
    let tempObj = { psoe: null, pp: null, vox: null, cs: null, podemos: null, iu: null, canda: null, pmas: null, axsi: null }
    
    data.map(row => {

      if (row.length > 1) {

        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) {
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PSC')) {
            tempObj['psoe'] = Number(row[columnNumber + 2])
          }
        }

        byParty.push(tempObj)

      }

    })

    // console.log(byParty)
  }
  
  const handleUploadedFile = file => {
    handlePaginaPueblos(file.data)
    handleMasVotados(file.data)
    handleOrderedByParty(file.data)
  }
  
  return (
    <>
    <h2 style={{ fontWeight: 100 }}>Elecciones locales 2023</h2>
    <CSVReader onUploadAccepted={(file) => { handleUploadedFile(file) }}>
    {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
      <>
      <div>
      <button style={{ fontWeight: 100, minWidth: '33vw' }} type='button' {...getRootProps()}>Subir datos</button>
      {/* <button style={{ fontWeight: 100 }} {...getRemoveFileProps()}>Limpiar memoria</button> */}
      </div>
      <ProgressBar style={{ marginBottom: '1rem' }} />
      </>
      )}
      </CSVReader>

      {
        (paginaPueblosData?.length || masVotadosData?.length || dataByParty?.length) &&
        <>
        <hr></hr>
        <h2 style={{ fontWeight: 100 }}>Resultados</h2>
        </>
      }
      
      {
        paginaPueblosData?.length && 
        <CSVDownloader type={Type.Button} filename={'28m-pagina-pueblos'} bom={true} config={{ delimiter: '\t', 'header': false }} data={paginaPueblosData}>
        <span style={{ fontWeight: 400 }}>Página de pueblos</span>
        </CSVDownloader>
      }
      
      {
        masVotadosData?.length && 
        <CSVDownloader type={Type.Button} filename={'28m-mas-votados'} bom={true} config={{ delimiter: '\t', 'header': true }} data={masVotadosData}>
        <span style={{ fontWeight: 400 }}>Más votados</span>
        </CSVDownloader>
      }
      
      </>
      )
    }
    
    export default App
    