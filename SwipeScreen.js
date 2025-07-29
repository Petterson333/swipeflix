import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  Dimensions,
  StatusBar,
  Alert,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées des films et séries
const MOCK_MOVIES = [
  {
    id: 1,
    title: "Inception",
    year: "2010",
    rating: 8.8,
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    genre: "Sci-Fi, Thriller",
    type: "movie",
    duration: "2h 28min",
    description: "Un voleur spécialisé dans l'extraction de secrets du subconscient est chargé d'implanter une idée dans l'esprit d'un PDG."
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    genre: "Action, Crime, Drama",
    type: "movie",
    duration: "2h 32min",
    description: "Batman affronte le Joker, un criminel anarchiste qui sème le chaos à Gotham City."
  },
  {
    id: 3,
    title: "Breaking Bad",
    year: "2008",
    rating: 9.5,
    poster: "https://m.media-amazon.com/images/M/MV5BMjhiMzgxZTctNDc1Ni00OTIxLTlhMTYtZTA3ZWFkODRkNmE2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    genre: "Crime, Drama, Thriller",
    type: "series",
    seasons: "5 saisons",
    description: "Un professeur de chimie se lance dans la production de méthamphétamine après avoir appris qu'il a un cancer."
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: "1994",
    rating: 8.9,
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    genre: "Crime, Drama",
    type: "movie",
    duration: "2h 34min",
    description: "Les vies de deux tueurs à gages s'entremêlent avec celles d'un boxeur et d'un gangster dans ce classique de Tarantino."
  },
  {
    id: 5,
    title: "Stranger Things",
    year: "2016",
    rating: 8.7,
    poster: "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_SX300.jpg",
    genre: "Drama, Fantasy, Horror",
    type: "series",
    seasons: "4 saisons",
    description: "Dans les années 80, un groupe d'enfants découvre des forces surnaturelles et des expériences gouvernementales secrètes."
  },
  {
    id: 6,
    title: "The Matrix",
    year: "1999",
    rating: 8.7,
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    genre: "Action, Sci-Fi",
    type: "movie",
    duration: "2h 16min",
    description: "Un hacker découvre que la réalité qu'il connaît n'est qu'une simulation informatique contrôlée par des machines."
  },
  {
    id: 7,
    title: "Game of Thrones",
    year: "2011",
    rating: 9.3,
    poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg",
    genre: "Action, Adventure, Drama",
    type: "series",
    seasons: "8 saisons",
    description: "Neuf familles nobles se disputent le contrôle des Sept Royaumes de Westeros dans cette épopée fantastique."
  }
];

// MovieCard component
const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8.5) return '#4ECDC4';
    if (rating >= 7.0) return '#FFE66D';
    if (rating >= 6.0) return '#FF8C42';
    return '#FF6B6B';
  };

  return (
    <View style={movieCardStyles.container}>
      <View style={movieCardStyles.card}>
        <View style={movieCardStyles.imageContainer}>
          {!imageError ? (
            <Image
              source={{ uri: movie.poster }}
              style={movieCardStyles.movieImage}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <View style={movieCardStyles.placeholderImage}>
              <Ionicons name="film-outline" size={60} color="#CCC" />
              <Text style={movieCardStyles.placeholderText}>Image non disponible</Text>
            </View>
          )}
          
          {!imageLoaded && !imageError && (
            <View style={movieCardStyles.loadingOverlay}>
              <Text style={movieCardStyles.loadingText}>Chargement...</Text>
            </View>
          )}

          <View style={[movieCardStyles.ratingBadge, { backgroundColor: getRatingColor(movie.rating) }]}>
            <Ionicons name="star" size={14} color="#FFF" />
            <Text style={movieCardStyles.ratingText}>{movie.rating}</Text>
          </View>

          {movie.type === 'series' && (
            <View style={movieCardStyles.typeBadge}>
              <Ionicons name="tv" size={14} color="#FFF" />
              <Text style={movieCardStyles.typeText}>Série</Text>
            </View>
          )}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={movieCardStyles.infoGradient}
        >
          <View style={movieCardStyles.movieInfo}>
            <Text style={movieCardStyles.movieTitle} numberOfLines={2}>
              {movie.title}
            </Text>
            <View style={movieCardStyles.movieMeta}>
              <Text style={movieCardStyles.movieYear}>{movie.year}</Text>
              <View style={movieCardStyles.separator} />
              <Text style={movieCardStyles.movieGenre} numberOfLines={1}>
                {movie.genre}
              </Text>
            </View>
            {movie.type === 'series' && movie.seasons && (
              <Text style={movieCardStyles.seasonInfo}>{movie.seasons}</Text>
            )}
          </View>
        </LinearGradient>

        <View style={movieCardStyles.swipeHints}>
          <Animated.View style={[movieCardStyles.swipeHint, movieCardStyles.likeHint]}>
            <Ionicons name="heart" size={20} color="#4ECDC4" />
            <Ionicons name="chevron-forward" size={16} color="#4ECDC4" />
          </Animated.View>
          <Animated.View style={[movieCardStyles.swipeHint, movieCardStyles.dislikeHint]}>
            <Ionicons name="chevron-back" size={16} color="#FF6B6B" />
            <Ionicons name="close" size={20} color="#FF6B6B" />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// Main SwipeScreen component
const SwipeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLikes, setUserLikes] = useState(new Set());
  const [partnerLikes, setPartnerLikes] = useState(new Set());
  const [matches, setMatches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    genre: 'all',
    minRating: 0,
  });
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [10, screenWidth / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-screenWidth / 4, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          forceSwipe('right');
        } else if (gestureState.dx < -120) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const movie = filteredMovies[currentIndex];
    
    if (direction === 'right') {
      handleLike(movie);
    }
    
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const filteredMovies = MOCK_MOVIES.filter(movie => {
    if (filters.type !== 'all' && movie.type !== filters.type) return false;
    if (movie.rating < filters.minRating) return false;
    if (filters.genre !== 'all' && !movie.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false;
    return true;
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = (movie) => {
    const newUserLikes = new Set(userLikes);
    newUserLikes.add(movie.id);
    setUserLikes(newUserLikes);

    const partnerAlsoLiked = Math.random() > 0.5;
    
    if (partnerAlsoLiked) {
      const newPartnerLikes = new Set(partnerLikes);
      newPartnerLikes.add(movie.id);
      setPartnerLikes(newPartnerLikes);
      
      const newMatches = [...matches, movie];
      setMatches(newMatches);
      
      setTimeout(() => {
        navigation.navigate('Match', { movie, matches: newMatches });
      }, 500);
    }
  };

  const handleButtonPress = (action) => {
    if (action === 'like') {
      forceSwipe('right');
    } else {
      forceSwipe('left');
    }
  };

  const renderCard = () => {
    if (currentIndex >= filteredMovies.length) {
      return (
        <View style={styles.noMoreCards}>
          <Ionicons name="film-outline" size={80} color="#FFF" style={{ marginBottom: 20, opacity: 0.8 }} />
          <Text style={styles.noMoreText}>Plus de contenu !</Text>
          <Text style={styles.noMoreSubtext}>Vous avez parcouru tous les films</Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => setCurrentIndex(0)}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.restartGradient}
            >
              <Ionicons name="refresh" size={20} color="#FFF" />
              <Text style={styles.restartText}>Recommencer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    const movie = filteredMovies[currentIndex];
    const cardStyle = {
      ...styles.cardContainer,
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate: rotate },
      ],
    };

    return (
      <Animated.View
        style={cardStyle}
        {...panResponder.panHandlers}
      >
        <MovieCard movie={movie} />
        
        <Animated.View style={[styles.likeOverlay, { opacity: likeOpacity }]}>
          <Ionicons name="heart" size={60} color="#FFF" />
          <Text style={styles.overlayText}>J'AIME</Text>
        </Animated.View>
        
        <Animated.View style={[styles.dislikeOverlay, { opacity: dislikeOpacity }]}>
          <Ionicons name="close-circle" size={60} color="#FFF" />
          <Text style={styles.overlayText}>PASSE</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderFilters = () => {
    return (
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filtersOverlay}>
          <View style={styles.filtersContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.filtersHeader}
            >
              <Text style={styles.filtersTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.filtersContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Type de contenu</Text>
                <View style={styles.typeButtons}>
                  {[
                    { key: 'all', label: 'Tout', icon: 'apps' },
                    { key: 'movie', label: 'Films', icon: 'film' },
                    { key: 'series', label: 'Séries', icon: 'tv' }
                  ].map(type => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeButton,
                        filters.type === type.key && styles.typeButtonActive
                      ]}
                      onPress={() => setFilters({...filters, type: type.key})}
                    >
                      <Ionicons 
                        name={type.icon} 
                        size={20} 
                        color={filters.type === type.key ? '#FFF' : '#667eea'} 
                      />
                      <Text style={[
                        styles.typeButtonText,
                        filters.type === type.key && styles.typeButtonTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {isPremium ? (
                <>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Note minimum</Text>
                    <View style={styles.ratingContainer}>
                      {[0, 5, 6, 7, 8, 9].map(rating => (
                        <TouchableOpacity
                          key={rating}
                          style={[
                            styles.ratingButton,
                            filters.minRating === rating && styles.ratingButtonActive
                          ]}
                          onPress={() => setFilters({...filters, minRating: rating})}
                        >
                          <Ionicons name="star" size={16} color={filters.minRating === rating ? '#FFF' : '#FFD700'} />
                          <Text style={[
                            styles.ratingButtonText,
                            filters.minRating === rating && styles.ratingButtonTextActive
                          ]}>
                            {rating}+
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Genre</Text>
                    <View style={styles.genreGrid}>
                      {['all', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance'].map(genre => (
                        <TouchableOpacity
                          key={genre}
                          style={[
                            styles.genreButton,
                            filters.genre === genre && styles.genreButtonActive
                          ]}
                          onPress={() => setFilters({...filters, genre})}
                        >
                          <Text style={[
                            styles.genreButtonText,
                            filters.genre === genre && styles.genreButtonTextActive
                          ]}>
                            {genre === 'all' ? 'Tous' : genre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.premiumSection}>
                  <LinearGradient
                    colors={['#FFD700', '#FFC700']}
                    style={styles.premiumCard}
                  >
                    <Ionicons name="star" size={40} color="#FFF" />
                    <Text style={styles.premiumTitle}>Débloquez Premium</Text>
                    <Text style={styles.premiumText}>
                      Accédez à tous les filtres avancés et trouvez exactement ce que vous cherchez !
                    </Text>
                    <TouchableOpacity 
                      style={styles.premiumButton}
                      onPress={() => setIsPremium(true)}
                    >
                      <Text style={styles.premiumButtonText}>Essayer gratuitement</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setCurrentIndex(0);
                setShowFilters(false);
              }}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.applyGradient}
              >
                <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Swipeflix</Text>
          <Text style={styles.headerSubtitle}>{filteredMovies.length - currentIndex} films restants</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options" size={24} color="#FFF" />
            {(filters.type !== 'all' || filters.genre !== 'all' || filters.minRating > 0) && (
              <View style={styles.filterIndicator} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.matchButton}>
            <Ionicons name="heart" size={20} color="#FFF" />
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{matches.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {renderCard()}
      </View>

      {renderFilters()}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => handleButtonPress('dislike')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF4757']}
            style={styles.actionGradient}
          >
            <Ionicons name="close" size={32} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3742fa', '#5f66f1']}
            style={styles.actionGradient}
          >
            <Ionicons name="star" size={28} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleButtonPress('like')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.actionGradient}
          >
            <Ionicons name="heart" size={28} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  filterButton: {
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 5,
  },
  matchText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.65,
    position: 'absolute',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 40,
    width: screenWidth * 0.85,
  },
  noMoreText: {
    fontSize: 28,
    color: '#FFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  noMoreSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  restartButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  restartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  restartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    left: 40,
    alignItems: 'center',
    transform: [{ rotate: '-30deg' }],
  },
  dislikeOverlay: {
    position: 'absolute',
    top: 50,
    right: 40,
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 50,
    gap: 20,
  },
  actionButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  superLikeButton: {
    width: 55,
    height: 55,
  },
  // Styles pour les filtres
  filtersOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: screenHeight * 0.85,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  filtersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  filtersContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#667eea',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
    gap: 5,
  },
  ratingButtonActive: {
    backgroundColor: '#FFD700',
  },
  ratingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA500',
  },
  ratingButtonTextActive: {
    color: '#FFF',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  genreButtonActive: {
    backgroundColor: '#764ba2',
  },
  genreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  genreButtonTextActive: {
    color: '#FFF',
  },
  premiumSection: {
    marginVertical: 20,
  },
  premiumCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
    marginBottom: 10,
  },
  premiumText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  applyButton: {
    margin: 20,
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});

// Styles pour MovieCard
const movieCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.65,
    backgroundColor: '#FFF',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderText: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  ratingBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  ratingText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  typeBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 0, 128, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
  },
  movieInfo: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieYear: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '600',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  movieGenre: {
    fontSize: 14,
    color: '#E0E0E0',
    flex: 1,
  },
  seasonInfo: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 5,
    fontStyle: 'italic',
  },
  swipeHints: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  likeHint: {
    backgroundColor: 'rgba(78, 205, 196, 0.95)',
  },
  dislikeHint: {
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
  },
});

export default SwipeScreen;