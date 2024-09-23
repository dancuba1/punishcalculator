import { useEffect, useState } from "react";
import CharacterInfo, { MoveInfo } from "./MoveInfo";
import OutputInfo from "./OutputInfo";
import Slideshow from "./Slideshow";
export function CalcOutput({singleImage, ssImages, aMove, pMoves, jumpSquat, isPunishable}) {
  const [currentPMove, setCurrentPMove] = useState([]);

  useEffect(() => {
    if (aMove !== null && pMoves !== null) {
        setCurrentPMove(pMoves[0]);
    }
  }, [aMove, pMoves]);

  const handleIndexChange = (index) => {
    setCurrentPMove(pMoves[index]);
  }
    
  const renderPMoves = () => {
    switch (ssImages) {
      case "Shield Breaks":
        return <h3>Shield Breaks so cannot punish out of shield</h3>;
      case "No advantage found": 
        return <h3>No advantage has been found</h3>;
      default:
        return (
          <>
            <div className="sshow pCharSlideShow">
              <Slideshow
                images={ssImages}
                onIndexChange={handleIndexChange}
              />
            </div>
            <MoveInfo currentMove={currentPMove} isPMove={true} />
          </>
        );
      }
    };

    
    const renderOutput = () => {
      switch(isPunishable){
        case false:
          return(
            <OutputInfo
            aMove={aMove}
            pMove={"Unpunishable"}
            jumpSquat={jumpSquat}
            />);
        default:
          return(
          <OutputInfo
          aMove={aMove}
          pMove={currentPMove}
          jumpSquat={jumpSquat}
          />);
      }
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
                    {renderPMoves()}
                  </div>
                  {renderOutput()}
                </div>
              </div>
            </div>
            
        </section>
      );
}

export default CalcOutput;
/*

                    */