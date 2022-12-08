import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { carouselItems } from '../utils/tutorialText'


const { width, height } = Dimensions.get('screen')
const PAGINATION_DOT_SIZE = 14
const PAGINATION_DOT_UNSELECTED_COLOR = 'rgba(105, 105,105, 0.5)'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: '800',
    fontSize: 30,
    marginBottom: 10,
    color: '#493d8a',
    textAlign: 'center'
  },
  description: {
    fontWeight: '500',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64
  },
  dotContainer: {
    width,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  paginationDot: {
    position: 'relative',
    borderRadius: PAGINATION_DOT_SIZE,
    width: PAGINATION_DOT_SIZE,
    height: PAGINATION_DOT_SIZE,
    marginBottom: 70,
    margin: 10,
    backgroundColor: PAGINATION_DOT_UNSELECTED_COLOR
  },
  paginationDotSelected: {
    position: 'relative',
    backgroundColor: 'black'
  },
  startButton: {
    padding: 15,
    backgroundColor: '#1160f2',
    justifyContent: 'center',
    borderRadius: 25,
    margin: 40,
    alignItems: 'center',
    flexDirection: 'row'
  },
  startText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
})

interface CarouselItems {
  title: string
  description: string
}
export default function OnBoardingScreen() {
  const flatListRef = useRef<FlatList<CarouselItems> | null>()
  const [ currentIndex, setCurrentIndex ] = useState(0)

  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index)
    }
  })
  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index })
  }

  const renderItems: React.FC<{ item: CarouselItems }> = ({ item }) => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={carouselItems}
        renderItem={renderItems}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={ref => {
          flatListRef.current = ref
        }}
        onViewableItemsChanged={onViewRef.current}
      />

      <View style={styles.dotContainer}>
        {carouselItems.map((_, index: number) => (
          <TouchableOpacity
            key={index.toString()}
            style={[
              styles.paginationDot,
              currentIndex === index ? styles.paginationDotSelected : {}
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
      <View>
        {currentIndex === carouselItems.length - 1 && (
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
