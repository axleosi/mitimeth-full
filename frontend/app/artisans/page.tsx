import React from 'react'
import styles from './Artisans.module.css'
import Other from '../components/Other'

const Artisans = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sCon}></div>
      
      <div className={styles.sCon}></div>

      <div className={styles.sCon}></div>

      <div className={styles.sCon}></div>

      <div className={styles.sCon}>
        <Other/>
      </div>
    </div>
  )
}

export default Artisans