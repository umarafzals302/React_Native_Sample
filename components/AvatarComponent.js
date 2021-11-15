
import React, { useState } from 'react';
import {
    Image,
    ActivityIndicator,
    View
} from 'react-native';

import Colors from 'constants/Colors'

const AvatarComponent = (props) => {
    const { source, size, defaultSource, style } = props

    const [loading, setLoading] = useState(false)
    const [imageSource, setImageSource] = useState(source)


    return (
        <View
            {...props}
            style={style}>
            <Image
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={imageSource ? imageSource.uri ? imageSource : { uri: imageSource, cache: 'force-cache' } : defaultSource ? defaultSource : null}
                onError={(e) => {
                    setImageSource(null)
                }}
                onLoadStart={() => {
                    setLoading(true)
                }}
                onLoadEnd={() => {
                    setLoading(false)
                }}
            />
            <View style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                alignItem: 'center', justifyContent: 'center'
            }}>
                <ActivityIndicator animating={loading} color={Colors.primaryColor} size={size ? size : 'large'} />
            </View>
        </View>
    )
}

export default AvatarComponent