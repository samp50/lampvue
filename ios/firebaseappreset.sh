rm -rf Pods
rm Podfile.lock
killall Xcode
rm -rf *.xcworkspace
pod install
open *.xcworkspace
