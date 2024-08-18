document.addEventListener("DOMContentLoaded", () => {
    const draggableElements = document.querySelectorAll(".draggable");
    const droppableElements = document.querySelectorAll(".droppable1, .droppable2, .droppable3, .droppable4");

    // Define image mappings for each draggable item
    const imageMap = {
        Hydrogen: {
            droppable1: "nh3.png", // Replace with actual image URL
            droppable2: "https://i0.wp.com/www.differencebetween.com/wp-content/uploads/2019/09/Difference-Between-Hydrogen-Fluoride-and-Hydrofluoric-Acid_Figure-2.png", 
            droppable3: "hcl.png",
            droppable4: "H2.png", 
        }
    };
    const textMap = {
        droppable1: "Compound: Ammonia.<br>Reaction Type: Synthesis.<br>Boiling Point: -33.34°C.<br>Melting Point: -77.73°C",
        droppable2: "Compound: Hydrogen Fluoride.<br>Reaction Type: Synthesis.<br>Boiling Point: 19.5°C.<br>Melting Point: -83.6°C.",
        droppable3: "Compound: Hydrogen Chloride.<br>Reaction Type: Synthesis.<br>Boiling Point: -85.05°C.<br>Melting Point: -114.2°C.",
        droppable4: "Compound: Hydrogen Gas.<br>Reaction Type: Synthesis.<br>Boiling Point: -252.87°C.<br>Melting Point: -259.16°C.",
    };

    draggableElements.forEach(elem => {
        elem.addEventListener("dragstart", dragStart);
    });

    droppableElements.forEach(elem => {
        elem.addEventListener("dragenter", dragEnter);
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("dragleave", dragLeave);
        elem.addEventListener("drop", drop);
    });

    function dragStart(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    function dragEnter(event) {
        event.preventDefault();
        if(!event.target.classList.contains("dropped")) {
            event.target.classList.add("droppable-hover");
        }
        
    }

    function dragOver(event) {
        if(!event.target.classList.contains("dropped")) {
            event.preventDefault();
            event.target.classList.add("droppable-hover");
        }

    }

    function dragLeave(event) {
        if(!event.target.classList.contains("dropped")) {
            event.target.classList.remove("droppable-hover");
        }
        
    }

    function drop(event) {
        event.preventDefault();
        event.target.classList.remove("droppable-hover");

        const draggableElementId = event.dataTransfer.getData("text");
        const droppableElement = event.target.closest("div");
        const droppableElementClass = droppableElement.classList[0];

        if (imageMap[draggableElementId] && imageMap[draggableElementId][droppableElementClass]) {
            const newImageUrl = imageMap[draggableElementId][droppableElementClass];
            event.target.classList.add("dropped");

            const imgElement = droppableElement.querySelector("img");
            if (imgElement) {
                imgElement.src = newImageUrl;
                imgElement.alt = `New Image for ${draggableElementId} on ${droppableElementClass}`;
                
                // Remove the existing image and add new text
                imgElement.addEventListener("click", () => {
                    imgElement.style.display = "none"; // hiding image
                    const textElement = document.createElement("span");
                    textElement.innerHTML = textMap[droppableElementClass] || "Image Removed";
                    textElement.classList.add("text-size");
                    droppableElement.appendChild(textElement); 
                });
            }
        }
    }
});
