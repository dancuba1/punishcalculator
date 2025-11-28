import { useEffect, useState } from "react";
import { MoveInfo } from "./MoveInfo";
import OutputInfo from "./OutputInfo";
import Slideshow from "./Slideshow";
import ParryToggle from "./ParryToggle";

// Simple skeleton loader component
function Skeleton({ height = 40, width = "100%", style = {} }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%)",
        borderRadius: "8px",
        height,
        width,
        margin: "8px 0",
        animation: "pulse 1.5s infinite",
        ...style,
      }}
      className="skeleton-loader"
    />
  );
}

export function CalcOutput({ aCharImage, pCharImages, aMove, pMoves, jumpSquat, isPunishable, loading, pChar, isParry, setIsParry, parryChange }) {
  const [currentPMove, setCurrentPMove] = useState([]);

  useEffect(() => {
    // only set currentPMove when we have a displayed aMove and pMoves are available
    if (aMove != null && Array.isArray(pMoves) && pMoves.length > 0) {
      setCurrentPMove(pMoves[0]);
    }
  }, [aMove, pMoves]);

  const handleIndexChange = (index) => {
    setCurrentPMove(pMoves[index]);
  };

  



  const renderPMoves = () => {
    if (loading) {
      return (
        <div>
          <Skeleton height={180} />
          <Skeleton height={32} width="80%" />
        </div>
      );
    }
    if (!pCharImages || !pMoves || !currentPMove) {
    return (
        <div>
          <Skeleton height={180} />
          <Skeleton height={32} width="80%" />
        </div>
      );
  }
    switch (pCharImages) {
      case "Shield Breaks":
        return <h3>Shield Breaks so cannot punish out of shield</h3>;
      case "No advantage found":
        return <h3>No advantage has been found</h3>;
      default:
        console.log("Rendering PMove: ", currentPMove);
        return (
          <>
              <h2 className="moveName">{currentPMove?.id}</h2>
              <div className="sshow pCharSlideShow">
                <Slideshow
                  images={pCharImages}
                  onIndexChange={handleIndexChange}
                />
              </div>
            <MoveInfo currentMove={currentPMove} isPMove={true} />
          
          </>
        );
    }
  };

  const renderOutput = () => {
    if (loading) {
      return <Skeleton height={60} width="90%" />;
    }
    switch (isPunishable) {
      case false:
        return (
          <OutputInfo
            aMove={aMove}
            pMove={"Unpunishable"}
            jumpSquat={jumpSquat}
          />
        );
      default:
        return (
          <OutputInfo
            aMove={aMove}
            pMove={currentPMove}
            jumpSquat={jumpSquat}
          />
        );
    }
  };

  return (
    <section className="calcRectangle">
      <div className="r">
        <div className="rec">
          <div className="movesGifsInfo">
            <div className="charinfo aCharInfo">
            {loading ? <Skeleton height={180} /> : 
              <>
              <h2 className="moveName">{aMove?.id}</h2>

              <div className="sshow aCharSlideShow">
                
                
                  <Slideshow images={aCharImage} />
              </div>

                </>}
              {loading ? <Skeleton height={32} width="80%" /> : <MoveInfo currentMove={aMove} isPMove={false} />}
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
          <ParryToggle isParry={isParry} setIsParry={setIsParry} />

                    */