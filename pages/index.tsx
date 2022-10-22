import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import words from "../utils/words";
import stopAudio from "../utils/stopAudio";

const Home: NextPage = () => {
  const [correctWord, setWord] = useState(words[0]);
  const [points, setPoints] = useState(0);
  const [currentTip, setTip] = useState(0);

  // Set the first random word
  useEffect(() => {
    if (correctWord.brand == "null") {
      setWord(words[Math.floor(Math.random() * (words.length - 1) + 1)]);
    }
  }, [correctWord.brand]);

  useEffect(() => {
    // Get the board 
    let board = document.getElementById("randomBrand") as HTMLInputElement;

    setInterval(async () => {
      // Select a random brand to the boars
      let { brand } = await words[Math.floor(Math.random() * words.length)];
      board.value = "";

      // If the brand is the first, changes him text
      if (brand == "null") brand = "Guess the Brand";

      for (let i = 0; i < brand.length; i++) {
        board.value += brand[i];
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }, 4500);
  }, []);

  const nextLevel = () => {
    // Clear the tips and get another word
    setTip(0);
    setWord(words[Math.floor(Math.random() * (words.length - 1) + 1)]);

    // Loop on all tips
    for (let li of Array.from(document.querySelectorAll(".tip"))) {
      li.remove();
    }

    // Loop on all li elements
    for (let li of Array.from(document.querySelectorAll("li"))) {
      if (li.innerHTML.length == 1) {
        console.log(li.innerHTML);
        li.style.backgroundColor = "#b3b3b3";
      }
    }
  };

  const newTip = () => {
    // Get the wrong audio elements
    let wrongEffect1 = document.getElementById("wrong-1") as HTMLAudioElement;
    let wrongEffect2 = document.getElementById("wrong-2") as HTMLAudioElement;

    let tips = correctWord.tips;

    // Stop all sounds
    stopAudio();

    if (!tips[currentTip + 1]) {
      wrongEffect2.play();
      setPoints(0);

      nextLevel();
    } else {
      // Creates a new tip and push it to the list
      let tipsList = document.getElementById("tips") as HTMLUListElement;
      let li = tipsList.appendChild(document.createElement("li"));

      li.innerHTML = tips[currentTip + 1];
      li.className = "tip";

      wrongEffect1.play();
      setTip(currentTip + 1);
    }
  };

  const sendWord = () => {
    // Get the audio and input elements
    let input = document.getElementById("word") as HTMLInputElement;
    let rightEffect = document.getElementById("correct") as HTMLAudioElement;

    // Brand and input's value in lower case
    let brand = correctWord.brand;
    let lower = input.value.toLowerCase();

    // Stop all sounds
    stopAudio();

    if (input.value.length == 0 || !words.find((i) => i.brand == lower)) {
      input.value = "";
      input.placeholder = "Digite uma marca ou empresa válida!";
      
      return setTimeout(() => (input.placeholder = ""), 2800);
    }


    if (lower == brand.toLowerCase()) {
      let morePoints = 3;

      if (currentTip == 1) morePoints--;
      else if (currentTip == 2) morePoints -= 2;

      // Plays the sound and set the points
      rightEffect.play();
      setPoints(morePoints);

      nextLevel();
    } else {
      for (let char of lower) {
        let list = Array.from(document.querySelectorAll("li"));
        let li = list.find((i) => i.innerHTML.toLowerCase() == char) as HTMLLIElement;

        // The index of the char in the typed word.
        let index = lower.indexOf(char);

        // Change the color of the keyboard buttons
        if (li && brand.includes(char) && brand.indexOf(char) == index) 
          li.style.backgroundColor = "green";
        
        else if (li && brand.includes(char)) 
          li.style.backgroundColor = "yellow";

        else if (li) 
          li.style.backgroundColor = "red";
      }

      newTip();
    }

    // Clear the input
    input.value = "";
  };

  return (
    <div className={styles.container}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Adivinhe a marca ou empresa!" />
        <title>Naming</title>
      </Head>

      <audio id="sound" src="/click.mp3" />

      <audio id="correct" src="/correto.mp3" />
      <audio id="wrong-1" src="/errado1.mp3" />
      <audio id="wrong-2" src="/errado2.mp3" />

      <main>
        <input
          title="-"
          value="Guess the Brand"
          id="randomBrand"
          className={styles.randomBrand}
          type="text"
          readOnly
        />
        <section className={styles.interface}>
          <input
            id="word"
            title="word"
            type="text"
            maxLength={correctWord.brand.length}
            onKeyDown={(ev) => {
              if (ev.key == "Enter") sendWord();
            }}
          />
          <br />
          <button onClick={sendWord}>Enviar</button>
        </section>

        <section className={styles.tips}>
          <h3 className={styles.points}>PONTOS - {points}</h3>
          <h3>DICAS</h3>
          <ul id="tips">
            <li>{correctWord.tips[0]}</li>
          </ul>
        </section>

        <section className={styles.keyboard}>
          <ul>
            {"abcdefghijklmnopqrstuvwxyz".split("").map((ch, index) => {
              return (
                <li
                  key={index}
                  onClick={(ev) => {
                    let input = document.getElementById("word" ) as HTMLInputElement;
                    let audio = document.getElementById("sound") as HTMLAudioElement;

                    if (input.value.length < correctWord.brand.length) {
                      input.value += ev.currentTarget.innerHTML;

                      stopAudio();
                      audio.play();
                    }
                  }}
                >
                  {ch.toUpperCase()}
                </li>
              );
            })}

            <li
              onClick={() => {
                let input = document.getElementById("word") as HTMLInputElement;
                input.value = "";
              }}
            >
              Limpar
            </li>
          </ul>
        </section>
      </main>
      <footer className={styles.footer}>
        <b>
          Créditos:&nbsp;
          <a href="https://github.com/DuckCoder1101">DuckCoder1101</a>.
        </b>
      </footer>
    </div>
  );
};

export default Home;
