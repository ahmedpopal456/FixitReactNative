import { colors } from 'fixit-common-ui';
import { StyleSheet } from 'react-native';

const FixRequestStyles = StyleSheet.create({
  titleWithAction: {
    fontWeight: 'bold',
    flexGrow: 1,
  },
  titleActionWrapper: {
    flexGrow: 0,
    marginTop: 5,
  },
  titleActionLabel: {
    color: colors.accent,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  nextPageIconWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 3,
    elevation: 3,
    paddingTop: 7,
    paddingLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  searchResultsContinueBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 10,
    zIndex: 10,
  },
  searchResultsMockImage: {
    width: 50,
    height: 50,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: '#333',
    marginRight: 20,
    flexGrow: 0,
  },
  searchResultsTouchableWrapper: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fixTagsWrapper: {
    marginTop: 10,
    marginBottom: -10,
    elevation: -1,
    zIndex: -1,
  },
  fixTagsAnimatedWrapper: {
    padding: 5,
    paddingBottom: 15,
    backgroundColor: '#eeeeee',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  fixTagWrapper: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  fixTagTouchableWrapper: {
    flexGrow: 0,
    marginLeft: 5,
    marginRight: -15,
  },
  fixTagContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default FixRequestStyles;
