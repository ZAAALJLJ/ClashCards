import '../css/LiveBattle.css';

function LiveBattle (){
    return(
        <div className='live-battle-page'>
            <div className='live-nav-bar'>
                <div className='live-title'>
                    Matheattics
                </div>
            </div>
            <div className='live-content'>
                <div className='live-ranking'></div>
                <div className='live-flashcard-container'></div>
            </div>
        </div>
    )
}

export default LiveBattle;