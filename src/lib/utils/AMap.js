//AMap.js
//高德地图  src="https://webapi.amap.com/maps?v=1.4.14&key=b696030ab8fdf03d6df4ec3ceedcd742"
export default function MapLoader() {
  return new Promise((resolve,reject)=>{
    if(window.AMap){
      resolve(window.AMap)
    }else{
      var script = document.createElement('script');
      script.type = "text/javascript";
      script.async = false;
      script.src = "https://webapi.amap.com/maps?v=1.4.14&key=b696030ab8fdf03d6df4ec3ceedcd742";
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
    
  })
}
