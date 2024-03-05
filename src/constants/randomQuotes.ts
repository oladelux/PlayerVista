const RandomQuotes = [
  {
    quote: 'Whether that was a penalty or not, the referee thought otherwise.',
    author: 'John Motson',
  },
  {
    quote: 'Guess who\'s there? Close your eyes and he never went away! Cristiano Ronaldo has stolen back the show!',
    author: 'Peter Drury',
  },
  {
    quote: 'The Theatre lives its Dream! Its fantasy hero retreads the boards! A phenomenon! Hello again, Stretford End: here I am!',
    author: 'Peter Drury',
  },
  {
    quote: 'And Seaman, just like a falling oak, manages to change direction.',
    author: 'John Motson',
  },
]

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * RandomQuotes.length)
  return RandomQuotes[randomIndex]
}
