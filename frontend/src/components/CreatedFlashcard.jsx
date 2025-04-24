import '../css/CreatedFlashcard.css'

function CreatedFlashcard (prop) {

    // CLICK test
    const createdCLicked = () => {
        prop.sendDataToParent({
            id: prop.card.id,
            question: prop.card.question,
            answer: prop.card.answer
          });
      };

    return (
        <div className="created-component" onClick={createdCLicked} style={{ cursor: 'pointer' }}>
            <div className="created-question">{prop.card.question}</div>
            <hr className='created-divider'/>
            <div className="created-answer">{prop.card.answer}</div>
        </div>
    )
}

 export default CreatedFlashcard;