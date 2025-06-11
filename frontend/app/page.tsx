

export default function Home() {
  return (
    <div className="con">
      <div className="heading">
        <h1>WELCOME TO <span>MITIMETH</span></h1>
        <p>Transforming waste | Innovating Materials | Building Livelihoods.</p><hr/>
      </div>

      <div className="owner">
        <h2><span>Mrs Achenyo Idachaba-Obaro</span>, our founder<br/>"At Mitimeth, we are turning an invasive aquatic weed into intricately woven pieces that add beauty to your space while creating a source of livelihoods for our community."</h2>
      </div>

      <div className="images">
        <div className="image">
          <img src="/mrsobaro.jpg"/>
          <p>Mrs Achenyo giving a speech at WeCyclers</p>
        </div>

        <div className="image">
          <img src="/government.jpg"/>
          <p>Mrs Achenyo with Mrs Titilayo Oshodi(Special Adviser to the Governor of Lagos State on climate change and Circular Economy)</p>
        </div>

        <div className="image">
          <img src="products.jpg"/>
          <p>Some of our various products</p>
        </div>

        <div className="image">
          <img src="kids.jpg"/>
          <p>Mitimeth educating children on the importance of sustainability</p>
        </div>
      </div>
    </div>
  );
}
