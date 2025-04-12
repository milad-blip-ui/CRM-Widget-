import './loader.css'
export const AppSpinner = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1a0526] font-poppins'>
      <div className="text-center w-[90%] max-w-[500px] p-[30px] bg-[#1a0526] rounded-[20px] backdrop-blur-[10px] animate-[fadeIn_0.8s_ease-out]">
        <h1 className="text-[2.5rem] mb-[10px] bg-gradient-to-r from-[#b76cfd] to-[#ff7ff5] bg-clip-text text-transparent [text-shadow:0_2px_10px_rgba(183,108,253,0.3)] font-bold">
          Creator Pro
        </h1>
        <p className="text-[#d9b3ff] mb-[30px] font-thin">
          Crafted by Farzan
        </p>
        
        <div className="w-full h-[8px] bg-[rgba(255,255,255,0.1)] rounded-[10px] overflow-hidden mb-[30px]">
          <div className="h-full w-0 bg-gradient-to-r from-[#8a2be2] to-[#b76cfd] rounded-[10px] transition-[width_0.3s_ease] animate-[progress_3s_ease-in-out_infinite]"></div>
        </div>
        
        <div className="text-[0.9rem] text-[#c78cff] mt-[-20px] mb-[20px] h-[20px]">
          Loading application
          <div className="inline-block ml-[5px]">
            <span className="inline-block w-[8px] h-[8px] rounded-full bg-[#b76cfd] mx-[2px] opacity-0 animate-[dotFade_1.5s_infinite]"></span>
            <span className="inline-block w-[8px] h-[8px] rounded-full bg-[#b76cfd] mx-[2px] opacity-0 animate-[dotFade_1.5s_infinite_0.2s]"></span>
            <span className="inline-block w-[8px] h-[8px] rounded-full bg-[#b76cfd] mx-[2px] opacity-0 animate-[dotFade_1.5s_infinite_0.4s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PageSpinner = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='loader'></div>
    </div>
  )
}





