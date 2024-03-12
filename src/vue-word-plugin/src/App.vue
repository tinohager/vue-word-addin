<template>
  <div id="app">
    <div class="content">
      <div class="content-header">
        <div class="padding">
          <h1>Welcome</h1>
        </div>
      </div>
      <div class="content-main">
        <div class="padding">
          <p>
            Choose the button below to set the color of the selected range to
            green.
          </p>
          <br />
          <h3>Try it out</h3>
          <button @click="onSetColor">Set text formating</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
async function onSetColor(): Promise<void> {
  await Word.run(async (context) => {
    let start = performance.now()

    const paragraphs = context.document.body.paragraphs

    context.load(paragraphs, ['items'])
    await context.sync()

    console.log(`Total paragraphs:${paragraphs.items.length}`)

    const wordCollectionCache: Word.RangeCollection[] = []

    for (let i = 0; i < paragraphs.items.length; ++i) {
      const paragraph = paragraphs.items[i]

      // Extract words from a sentence
      const wordCollection = paragraph.getTextRanges([' '], true)
      wordCollectionCache.push(wordCollection)
    }

    // Load all words
    for (const word of wordCollectionCache) {
      context.load(word, ['items', 'text'])
    }
    await context.sync()

    let end = performance.now()
    console.log(`Execution time load words: ${end - start} ms`)
    start = performance.now()

    console.log(`process words... (${wordCollectionCache.length})`)
    const charRangeCollectionCache: Word.RangeCollection[] = []
    for (const words of wordCollectionCache) {
      for (let i = 0; i < words.items.length; ++i) {
        const word = words.items[i]

        // if (word.text !== "Lorem") {
        //   continue;
        // }

        const charRangeCollection = word.search('?', {
          matchWildcards: true,
          matchCase: false,
          ignoreSpace: true,
          ignorePunct: true,
          matchPrefix: false,
          matchSuffix: false,
          matchWholeWord: false
        })
        // const charRangeCollection = word.search("*", {
        //   matchWildcards: true,
        //   matchCase: false,
        //   ignoreSpace: true,
        //   ignorePunct: true,
        //   matchPrefix: false,
        //   matchSuffix: false,
        //   matchWholeWord: false,
        // })

        // const charRangeCollection = word.getRange().split([""]);

        charRangeCollectionCache.push(charRangeCollection)
      }
    }

    end = performance.now()
    console.log(`Execution time load charRangeCollections1: ${end - start} ms`)
    start = performance.now()

    for (const charRangeCollection of charRangeCollectionCache) {
      context.load(charRangeCollection, ['items', 'font'])
    }
    end = performance.now()
    console.log(`Execution time load charRangeCollections2: ${end - start} ms`)
    start = performance.now()

    await context.sync()

    end = performance.now()
    console.log(`Execution time load charRangeCollections3: ${end - start} ms`)
    start = performance.now()

    console.log(`process chars... (${charRangeCollectionCache.length})`)
    for (const charRangeCollection of charRangeCollectionCache) {
      for (let i = 0; i < charRangeCollection.items.length; ++i) {
        if (i < 2) {
          if (charRangeCollection.items[i].font.bold !== true) {
            charRangeCollection.items[i].font.bold = true
          }
        } else {
          // charRanges.items[z].font.bold = false;
          break
        }
      }
    }

    end = performance.now()
    console.log(`Set font style: ${end - start} ms`)
    start = performance.now()

    console.log('last sync step, update document')
    await context.sync()
    console.log('done')

    end = performance.now()
    console.log(`Execution time context sync: ${end - start} ms`)
  })
}
</script>

<style scoped>
.content-header {
  background: #2a8dd4;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.content-main {
  background: #fff;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.padding {
  padding: 15px;
}
</style>
