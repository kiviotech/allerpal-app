import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';

const CustomCheckbox = ({ isChecked, onPress, height = 30, width = 30, borderRadius = 5 }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
            <View
                style={[
                    styles.checkbox,
                    isChecked && styles.checked,
                    { height, width, borderRadius } // Apply dynamic height, width, and borderRadius
                ]}
            >
                {isChecked && (
                    <Icon
                        name="check"
                        size={Math.min(height, width) * 0.8}
                        color="white"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        borderWidth: 2,
        borderColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: colors.secondary,
    },
});

export default CustomCheckbox;
