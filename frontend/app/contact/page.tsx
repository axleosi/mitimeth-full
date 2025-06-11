'use client'
import React from 'react'
import dynamic from 'next/dynamic';
import styles from './Contact.module.css'
import Form from '../components/Form'
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const contact = () => {
  return (
    <div className={styles.container}>
      <div className={styles.quote}>
        <h3>&quot;All Things Water Hyacinth&quot; Boutique in Lagos!</h3>
      </div>

      <div className={styles.text}>
        <p>
          Mitimeth welcomes you to our &quot;fit-for-purpose&quot; boutiques and office space located in Falomo, Lagos. Both boutiques mark the realization of a dream to amplify our transformation of waste, innovation of materials and building livelihoods, step by step, community by community, one pant fibre at a time. A new luxury elegance of woven water hyacinth and agricultural residues.
        </p>
        <p>
          The MitiMeth office location at No.1 LASWA Yard in Falomo-Ikoyi, Lagos isn&apos;t by some random coincidence. It is as a result of a strategic partnership between MitiMeth and Lagos State Waterways Authority(LASWA). We couldn&apos;t have asked for a better location beside the Lagos lagoon that has the raw material source.
        </p>
        <p>
          You can&apos;t miss our store front at No.1 Alfred Rewane, Ikoyi situated in Falomo Square, a lovely strip mall with several stores and services. We are open from 10am-6pm, Monday through Saturday.
        </p>
      </div>

      <div className={styles.map}>
        <Map />
      </div>

      <div className={styles.form}>
        <Form />
      </div>
    </div>
  )
}

export default contact;
