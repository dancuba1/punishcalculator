import { useEffect, useState } from "react";
import CharacterInfo, { MoveInfo } from "./MoveInfo";
import OutputInfo from "./OutputInfo";
import Slideshow from "./Slideshow";
export function CalcOutput({singleImage, ssImages, aMove, pMoves}) {
    const [currentPMove, setCurrentPMove] = useState([]);
    useEffect(() => {
      if (aMove !== null && pMoves !== null) {
          setCurrentPMove(pMoves[0]);
      }
  }, [aMove, pMoves]);
    const handleIndexChange = (index) => {
      setCurrentPMove(pMoves[index]);
    }
    
    return(
        <section className='calcRectangle'>
            <div className="r">
              <div className='rec'>
                <div className='movesGifsInfo'>
                  <div className="charinfo aCharInfo">
                    <div className='sshow aCharSlideShow'>
                      <Slideshow images ={singleImage}/>
                    </div>
                    <MoveInfo
                      currentMove={aMove}
                      isPMove={false}
                    />
                  </div>
                  <div className="charinfo pCharInfo">
                    <div className='sshow pCharSlideShow'>
                        <Slideshow images ={ssImages}
                          onIndexChange={handleIndexChange}
                        />
                    </div>
                    <MoveInfo
                      currentMove={currentPMove}
                      isPMove={true}
                    />
                  </div>
                  <OutputInfo
                    aMove={aMove}
                    pMove={currentPMove}
                    />
                </div>
              </div>
            </div>
            
        </section>
      );
}

export default CalcOutput;
/*

                    */