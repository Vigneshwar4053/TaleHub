document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.getElementById("uploadBtn");
    const uploadImage = document.getElementById("uploadImage");
    const saveBtn = document.getElementById("saveBtn");
    const grammarCheckBtn = document.getElementById("grammarCheckBtn");
    const generateContentBtn = document.getElementById("generateContentBtn");
    const storyContent = document.getElementById("storyContent");

    const saveModal = document.getElementById("saveModal");
    const closeModal = document.querySelector(".close");
    const saveForm = document.getElementById("saveForm");
    let selectedTemplate = null;

    uploadBtn.addEventListener("click", function() {
        uploadImage.click();
    });

    uploadImage.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.maxWidth = "10%";
                img.style.margin = "10px 0";
                img.contentEditable = "false"; // Prevent direct editing of the image
                img.style.resize = "both"; // Allow resizing
                img.style.overflow = "auto"; // Handle overflow

                // Wrap the image in a div to make it resizable and draggable
                const imgWrapper = document.createElement("div");
                imgWrapper.contentEditable = "false";
                imgWrapper.style.position = "relative";
                imgWrapper.style.display = "inline-block";
                imgWrapper.style.width = "auto";
                imgWrapper.style.height = "auto";
                imgWrapper.appendChild(img);

                storyContent.appendChild(imgWrapper);
            }
            reader.readAsDataURL(file);
        }
    });

    saveBtn.addEventListener("click", function() {
        saveModal.style.display = "block";
    });

    closeModal.addEventListener("click", function() {
        saveModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == saveModal) {
            saveModal.style.display = "none";
        }
    });

    document.querySelectorAll(".poster-template").forEach(template => {
        template.addEventListener("click", function() {
            document.querySelectorAll(".poster-template").forEach(t => t.classList.remove("selected"));
            template.classList.add("selected");
            selectedTemplate = template.innerText;
        });
    });

    saveForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const storyTitle = document.getElementById("storyTitle").value;
        const storyContentHtml = storyContent.innerHTML;
        const genre = document.getElementById("genre").value;

        // Create a poster with the selected template
        const poster = document.createElement("div");
        poster.style.width = "600px";
        poster.style.height = "800px";
        poster.style.backgroundColor = selectedTemplate === "Template 1" ? "lightblue" : selectedTemplate === "Template 2" ? "lightgreen" : "lightcoral";
        poster.style.color = "#000";
        poster.style.display = "flex";
        poster.style.flexDirection = "column";
        poster.style.alignItems = "center";
        poster.style.justifyContent = "center";
        poster.style.padding = "20px";
        poster.innerHTML = `
            <h1>${storyTitle}</h1>
            <h2>${genre}</h2>
        `;

        // Save the story and poster content
        console.log("Story saved with title:", storyTitle);
        console.log("Story content:", storyContentHtml);
        console.log("Selected genre:", genre);
        console.log("Selected template:", selectedTemplate);

        // Convert poster to image (optional, for further processing)
        html2canvas(poster).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${storyTitle}-poster.png`;
            link.click();
        });

        saveModal.style.display = "none";
    });

    grammarCheckBtn.addEventListener("click", function() {
        const content = storyContent.innerText;
        fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'text': content,
                'language': 'en-US'
            })
        })
        .then(response => response.json())
        .then(data => {
            let correctedContent = content;
            data.matches.forEach(match => {
                const replacement = match.replacements[0]?.value || '';
                correctedContent = correctedContent.slice(0, match.offset) + replacement + correctedContent.slice(match.offset + match.length);
            });
            storyContent.innerText = correctedContent;
        });
    });

    // generateContentBtn.addEventListener("click", async function() {
    //     const currentContent = storyContent.innerText;
    //     try {
    //         const response = await fetch('/generate-content', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ content: currentContent }),
    //         });
    //         const data = await response.json();
    //         storyContent.innerHTML += `<p>${data.generatedContent}</p>`;
    //     } catch (error) {
    //         console.error('Error generating content:', error);
    //     }
    // });
    document.getElementById("generateContentBtn").addEventListener("click", async function() {
        try {
            const title = document.getElementById("storyTitle").value
        
            const response = await fetch(`http://localhost:7700/story/${title}`);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            //document.getElementById("storyContent").innerHTML = data.message;
            //////////////////////
            const descriptionText = data.message;
            const descriptionElement = document.getElementById("storyContent");

            let words = descriptionText.split(" ");
            let index = 0;

            function displayWord() {
                if (index < words.length) {
                    descriptionElement.innerHTML += words[index] + " ";
                    index++;
                    setTimeout(displayWord, 100); 
                }
            }

            displayWord();
            //////////////////////
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
            if (error.message.includes("ValueError")) {
                document.getElementById("storyContent").innerHTML = "Try After sometime API is Busy.."
                console.error("Caught a value error:", error.message);
            }

        }
        
    });
});
