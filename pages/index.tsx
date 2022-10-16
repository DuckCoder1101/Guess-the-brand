import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import words from '../utils/words'

const Home: NextPage = () => {

  const [correctWord, setWord] = useState(words[0]);
  const [points, setPoints] = useState(0);
  const [currentTip, setTip] = useState(0);

  // Set the first random word
  useEffect(() => {
    if (correctWord.brand == "null") {
      setWord(words[Math.floor(Math.random() * (words.length -1) +1)]);
    }
  }, [correctWord]);

  const nextLevel = () => {

    // Clear the tips and get another word
    setTip(0);
    setWord(words[Math.floor(Math.random() * (words.length -1) +1)]);

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
    let tipsList = document.getElementById("tips") as HTMLUListElement;
    let tips = correctWord.tips;

    if (!tips[currentTip +1]) {
      setPoints(0);
      nextLevel();  
    } else {
      // Creates a new tip and push it to the list
      let li = tipsList.appendChild(document.createElement("li"));

      li.innerHTML = tips[currentTip +1];
      li.className = "tip";

      setTip(currentTip +1);
    }
  };

  const sendWord = () => {

    let brand = correctWord.brand;

    // Get the value of the input and turns it to lower case.
    let input = document.getElementById("word") as HTMLInputElement;
    let lower = input.value.toLowerCase();

    if (input.value.length == 0 || !words.find((i) => i.brand == lower)) {
      input.value = "";
      input.placeholder = "Digite uma marca ou empresa válida!";

      return setTimeout(() => input.placeholder = "", 3000);
    };

    // If the typed word is correct or not
    if (lower === brand.toLowerCase()) {
      // Very hard thernary, good luck to understand ;)
      setPoints(currentTip == 0 ? points +3 : currentTip == 1 ? points +2 : points +1);
      nextLevel();
    } else {
      for (let char of lower) {
        // The index of the char in the typed word (lower).
        let index = lower.indexOf(char);
        // Get the list of li elements.
        let li = Array.from(document.querySelectorAll("li"))
          .find((i) => i.innerHTML.toLowerCase() == char) as HTMLLIElement;

        // Change the color of the keyboard buttons
        if (li && brand.includes(char) && brand.indexOf(char) == index) {
          li.style.backgroundColor = "green";
        } else if (li &&brand.includes(char)) {
          li.style.backgroundColor = "yellow";
        } else if (li) {
          li.style.backgroundColor = "gray";
        }
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
      <main>
        <section className={styles.interface}>
          <input
            id="word"
            title="word"
            type="text"
            maxLength={correctWord.brand.length}
            onKeyDown={(ev) => {
              if (ev.key == "Enter") {
                sendWord();
              }
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
                    let input = document.getElementById(
                      "word"
                    ) as HTMLInputElement;

                    if (input.value.length < correctWord.brand.length) {
                      input.value += ev.currentTarget.innerHTML;
                    }
                  }} 
                >
                  {ch.toUpperCase()}
                </li>
              );
            })}
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
}

export default Home
