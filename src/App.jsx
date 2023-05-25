import { useEffect, useState } from 'react'
import { each, first } from 'lodash'
import { useCSVReader, useCSVDownloader } from 'react-papaparse'

import './App.css'

import municipiosPartidosElectorales from './data/partidoselectorales.json'

function App() {
  
  const escanosPorPartido = [
    {
      "partido_electoral": "Granada",
      "escanos": 16
    },
    {
      "partido_electoral": "Costa",
      "escanos": 3
    },
    {
      "partido_electoral": "Órgiva",
      "escanos": 2
    },
    {
      "partido_electoral": "Baza",
      "escanos": 2
    },
    {
      "partido_electoral": "Guadix",
      "escanos": 2
    },
    {
      "partido_electoral": "Loja",
      "escanos": 2
    }
  ]  
  
  const { CSVReader } = useCSVReader()
  const { CSVDownloader, Type } = useCSVDownloader()
  
  const [rawData, setRawData] = useState([])
  const [paginaPueblosData, setPaginasPueblosData] = useState()
  const [masVotadosData, setMasVotadosData] = useState()
  const [dataByParty, setDataByParty] = useState()
  const [checked, setChecked] = useState(false)
  const [isDiputacion, setIsDiputacion] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const handlePaginaPueblos = data => {
    // const municipiosObjects = data.map(row => {
    //   return {
    //     municipio: row[6]?.trim(),
    //     porcentajeVotantes: row[14] ? (Number(row[14]?.toString().replace(',','.')).toString().replace('.',',')) : null,
    //     uno: row[23]?.trim(),
    //     unoConcejales: Number(row[26]) !== 0 ? Number(row[26]) : null,
    //     dos: row[28]?.trim(),
    //     dosConcejales: Number(row[31]) !== 0 ? Number(row[31]) : null,
    //     tres: row[33]?.trim(),
    //     tresConcejales: Number(row[36]) !== 0 ? Number(row[36]) : null,
    //     cuatro: row[38]?.trim(),
    //     cuatroConcejales: Number(row[41]) !== 0 ? Number(row[41]) : null,
    //     cinco: row[43]?.trim(),
    //     cincoConcejales: Number(row[46]) !== 0 ? Number(row[46]) : null,
    //     seis: row[48]?.trim(),
    //     seisConcejales: Number(row[51]) !== 0 ? Number(row[51]) : null
    //   }
    // })
    
    const municipiosObjects = []
    
    each(data, row => {
      let tempMunicipioObject = {
        municipio: row[6]?.trim()
      }
      
      if (!checked) {
        tempMunicipioObject.porcentajeVotantes = row[14] ? (Number(row[14] / 100)).toString().replace('.', '.') : null
      }
      
      tempMunicipioObject.uno = row[23]?.trim()
      if (!checked) {
        tempMunicipioObject.unoPorcentaje = Number(row[25]) !== 0 ? (Number(row[25]) / 100).toString().replace('.', '.') : null
      }
      tempMunicipioObject.unoConcejales = Number(row[26]) !== 0 ? Number(row[26]) : null
      
      tempMunicipioObject.dos = row[28]?.trim()
      if (!checked) {
        tempMunicipioObject.dosPorcentaje = Number(row[30]) !== 0 ? (Number(row[30]) / 100).toString().replace('.', '.') : null
      }
      tempMunicipioObject.dosConcejales = Number(row[31]) !== 0 ? Number(row[31]) : null
      
      tempMunicipioObject.tres = row[33]?.trim()
      if (!checked) {
        tempMunicipioObject.tresPorcentaje = Number(row[35]) !== 0 ? (Number(row[35]) / 100).toString().replace('.', '.') : null
      }
      tempMunicipioObject.tresConcejales = Number(row[36]) !== 0 ? Number(row[36]) : null
      
      tempMunicipioObject.cuatro = row[38]?.trim()
      if (!checked) {
        tempMunicipioObject.cuatroPorcentaje = Number(row[40]) !== 0 ? (Number(row[40]) / 100).toString().replace('.', '.') : null
      }
      tempMunicipioObject.cuatroConcejales = Number(row[41]) !== 0 ? Number(row[41]) : null
      
      tempMunicipioObject.cinco = row[43]?.trim()
      if (!checked) {
        tempMunicipioObject.cincoPorcentaje = Number(row[45]) !== 0 ? (Number(row[45]) / 100).toString().replace('.', '.') : null
      }
      tempMunicipioObject.cincoConcejales = Number(row[46]) !== 0 ? Number(row[46]) : null
      
      if (!checked) {
        tempMunicipioObject.seis = row[48]?.trim()
        tempMunicipioObject.seisPorcentaje = Number(row[50]) !== 0 ? (Number(row[50]) / 100).toString().replace('.', '.') : null
        tempMunicipioObject.seisConcejales = Number(row[51]) !== 0 ? Number(row[51]) : null
      }
      
      municipiosObjects.push(tempMunicipioObject)
      
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
    
    data.forEach(row => {
      
      let tempObj = { 
        municipio: null, 
        psoe: null, 
        pp: null, 
        vox: null, 
        cs: null, 
        podemos: null, 
        iu: null, 
        canda: null, 
        pmas: null, 
        axsi: null, 
        adelante: null 
      }
      
      if (row.length > 1) {
        
        tempObj.municipio = row[6]?.trim()
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) {
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PSOE')) {
            tempObj['psoe'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PP')) {
            tempObj['pp'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('VOX')) {
            tempObj['vox'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('CS')) {
            tempObj['cs'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PARA LA GENTE')) {
            tempObj['iu'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PODEMOS')) {
            tempObj['podemos'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('PMAS')) {
            tempObj['pmas'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('AXSI')) {
            tempObj['axsi'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('UA')) {
            tempObj['canda'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
        for (let columnNumber = 0; columnNumber < row.length; columnNumber++) { 
          if (typeof row[columnNumber] === 'string' && row[columnNumber].includes('ADELANTE')) {
            tempObj['adelante'] = Number(row[columnNumber + 1].replace(',','.')).toString().replace('.',',')
          }
        }
        
      }
      
      byParty.push(tempObj)
      
    })
    
    setDataByParty(byParty)
  }
  
  const handleUploadedFile = file => {
    setRawData(file.data)
    
    handlePaginaPueblos(file.data)
    handleMasVotados(file.data)
    handleOrderedByParty(file.data)
    
    setLoaded(true)
  }
  
  const handleCheckedChange = () => {
    setChecked(!checked)
  }
  
  const handleIsDiputacion = () => {
    setIsDiputacion(!isDiputacion)
    handleDiputacionResults()
  }
  
  const getNewEscano = (votos, escanos, partidos) => {
    let max = 0, imax = 0
    
    for (let i = 0; i < partidos; i++) {
      
      if (max<(votos[i]/(escanos[i]+1)) ) {
        max=votos[i]/(escanos[i]+1);
        imax=i;
      }
      
    }
    
    return imax
  }
  
  const handleDiputacionResults = () => {
    
    let aggregatedPartidoElectoralResults = []
    
    for (let partidoElectoral of escanosPorPartido) {
      
      let finalObject = {
        partido: partidoElectoral.partido_electoral,
        escanos: partidoElectoral.escanos,
        resultados: []
      }
      
      let municipiosPartido = municipiosPartidosElectorales.filter(e => e.partido_electoral === partidoElectoral.partido_electoral)
      let votosPorMunicipio = []
      let byParty = []
      
      for (let municipio of municipiosPartido) {
        let municipioData = first(rawData.filter(e => e[6]?.trim() === municipio.municipio))
        
        if (municipioData && municipioData[13]) {
          
          let totalVotos = Number(municipioData[13])
          votosPorMunicipio.push({ municipio: municipio.municipio, totalVotos })
          
          finalObject.totalVotos = votosPorMunicipio.map(e => e.totalVotos).reduce((a,b) => a+b, 0)
          finalObject.umbralMinimo = Math.ceil(finalObject.totalVotos * 0.05) // Umbral mínimo del 5% en elecciones locales
          
          let tempObj = { 
            municipio: null, 
            psoe: null, 
            pp: null, 
            vox: null, 
            cs: null, 
            podemos: null, 
            iu: null, 
            canda: null, 
            pmas: null, 
            axsi: null, 
            adelante: null 
          }
          
          tempObj.municipio = municipio.municipio
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) {
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('PSOE')) {
              tempObj['psoe'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('PP')) {
              tempObj['pp'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('VOX')) {
              tempObj['vox'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('CS')) {
              tempObj['cs'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('PARA LA GENTE')) {
              tempObj['iu'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('PODEMOS')) {
              tempObj['podemos'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('PMAS')) {
              tempObj['pmas'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('AXSI')) {
              tempObj['axsi'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('UA')) {
              tempObj['canda'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          for (let columnNumber = 0; columnNumber < municipioData.length; columnNumber++) { 
            if (typeof municipioData[columnNumber] === 'string' && municipioData[columnNumber].includes('ADELANTE')) {
              tempObj['adelante'] = Number(municipioData[columnNumber + 1].replace(',','.')).toString().replace('.',',')
            }
          }
          
          byParty.push(tempObj)
          
        }
        
      }
      
      finalObject.resultados.push(
        { partido: 'psoe', votos: byParty.map(e => Number(e['psoe'])).reduce((a,b) => a+b, 0) },
        { partido: 'pp', votos: byParty.map(e => Number(e['pp'])).reduce((a,b) => a+b, 0) },
        { partido: 'vox', votos: byParty.map(e => Number(e['vox'])).reduce((a,b) => a+b, 0) },
        { partido: 'cs', votos: byParty.map(e => Number(e['cs'])).reduce((a,b) => a+b, 0) },
        { partido: 'iu', votos: byParty.map(e => Number(e['iu'])).reduce((a,b) => a+b, 0) },
        { partido: 'podemos', votos: byParty.map(e => Number(e['podemos'])).reduce((a,b) => a+b, 0) },
        { partido: 'pmas', votos: byParty.map(e => Number(e['pmas'])).reduce((a,b) => a+b, 0) },
        { partido: 'axsi', votos: byParty.map(e => Number(e['axsi'])).reduce((a,b) => a+b, 0) },
        { partido: 'canda', votos: byParty.map(e => Number(e['canda'])).reduce((a,b) => a+b, 0) },
        { partido: 'adelante', votos: byParty.map(e => Number(e['adelante'])).reduce((a,b) => a+b, 0) })
        
        aggregatedPartidoElectoralResults.push(finalObject)
        
      }
      
      for (let partidoElectoral of aggregatedPartidoElectoralResults) {
        
        partidoElectoral.repartoEscanos = []
        
        let partidosValidos = 0
        let votosOk = []
        let nombresOk = []
        let reparto = []
        
        for (let i = 0; i < partidoElectoral.resultados.length; i++) {
          // console.log(partidoElectoral.resultados[i])
          
          if (partidoElectoral.resultados[i].votos > partidoElectoral.umbralMinimo) {
            votosOk[partidosValidos] = partidoElectoral.resultados[i].votos // votos del partido
            nombresOk[partidosValidos] = partidoElectoral.resultados[i].partido // nombre del partido
            partidosValidos++
          }
        }
        
        for (let i = 0; i < partidosValidos; i++) {
          reparto[i] = 0
        }
        
        for (let i = 0; i < partidoElectoral.escanos; i++) {
          reparto[getNewEscano(votosOk, reparto, partidosValidos)]++
        }
        
        for (let i = 0; i < partidosValidos; i++) {
          partidoElectoral.repartoEscanos.push({ partido: nombresOk[i], escanos: reparto[i] })
        }
        
      }

      console.log(aggregatedPartidoElectoralResults)
      
    }
    
    return (
      <>
      <h2 style={{ fontWeight: 100 }}>Elecciones locales 2023</h2>
      <CSVReader onUploadAccepted={(file) => { handleUploadedFile(file) }}>
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
        
        <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="is-granada">
        <input type="checkbox" name="is-granada" id="is-granada" checked={checked} onChange={handleCheckedChange} />
        Datos de Granada
        </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="is-diputacion">
        <input disabled={!loaded} type="checkbox" name="is-diputacion" id="is-diputacion" checked={isDiputacion} onChange={handleIsDiputacion} />
        Calcular Diputación
        </label>
        </div>
        
        
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
        
        {
          dataByParty?.length && 
          <CSVDownloader type={Type.Button} filename={'28m-por-partidos'} bom={true} config={{ delimiter: '\t', 'header': true }} data={dataByParty}>
          <span style={{ fontWeight: 400 }}>Por partidos</span>
          </CSVDownloader>
        }
        
        </>
        )
      }
      
      export default App
      