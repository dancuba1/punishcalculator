import { useEffect, useState } from "react";
import { MoveInfo } from "./MoveInfo";
import OutputInfo from "./OutputInfo";
import Slideshow from "./Slideshow";

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

export function CalcOutput({ singleImage, ssImages, aMove, pMoves, jumpSquat, isPunishable, loading }) {
  const [currentPMove, setCurrentPMove] = useState([]);

  useEffect(() => {
    if (aMove !== null && pMoves !== null) {
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
              <div className="sshow aCharSlideShow">
                {loading ? <Skeleton height={180} /> : <Slideshow images={singleImage} />}
              </div>
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

                    */