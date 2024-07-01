document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const openPopupBtn = document.getElementById('miauw');
    const closeBtn = document.querySelector('.close-btn');
 
    openPopupBtn.onclick = function() {
        popup.style.display = 'block';  
    }
 
    closeBtn.onclick = function() {
        popup.style.display = 'none';
    }
 
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    }

    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin');
    const geluid = document.getElementById('geluid');
    const segments = ['Rood', 'Oranje', 'Suprise', 'Blauw'];
    const colors = ['#FF5733', '#FFBD33', '#4B0082', '#0000FF'];
    const totalSegments = segments.length;
    const segmentAngle = 2 * Math.PI / totalSegments;
    let currentAngle = 0;
    let isSpinning = false;
    const jsConfetti = new JSConfetti();

    function drawWheel() {
        for (let i = 0; i < totalSegments; i++) {
            const startAngle = currentAngle + i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#000";
            ctx.font = "bold 18px Arial";
            ctx.fillText(segments[i], canvas.width / 2 - 10, 10);
            ctx.restore();
        }
    }

    function spinWheel() {
        if (isSpinning) return;
        isSpinning = true;
        let spinDuration = 2000;
        let spinAngle = Math.random() * 10 + 20;
        let start = null;

        function animate(timestamp) {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            let currentSpin = easeOut(progress, 0, spinAngle, spinDuration);
            currentAngle += currentSpin;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWheel();
            if (progress < spinDuration) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                const winnerIndex = Math.floor((currentAngle % (2 * Math.PI)) / segmentAngle);
                celebrate(segments[winnerIndex]);
            }
        }

        requestAnimationFrame(animate);
    }

    function easeOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    function celebrate(winner) {
        for (let i = 0; i < 5; i++) {
            createConfetti();
        }
        Swal.fire({
            title: "Gefeliciteerd!",
            text: `De winnaar is: ${winner}`,
            icon: "success",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                if (winner === 'Rood') {
                    window.location.href = 'rood.html';
                } else if (winner === 'Oranje') {
                    window.location.href = 'oranje.html';
                } else if (winner === 'Suprise') {
                    window.location.href = 'suprise.html';
                } else if (winner === 'Blauw') {
                    window.location.href = 'blauw.html';
                }
            }
        });
    }

    function createConfetti() {
        jsConfetti.addConfetti({
            emojis: ['🚗', '🚐', '🛻'],
        });
    }

    drawWheel();
    spinButton.addEventListener('click', spinWheel);
});
