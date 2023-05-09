class UserSettings {
  private _lowInterval = 1
  private _highInterval = 5
  private _initialScore = 50

  public get lowInterval() {
    return this._lowInterval
  }
  public set lowInterval(value) {
    this._lowInterval = value
  }
  public get highInterval() {
    return this._highInterval
  }
  public set highInterval(value) {
    this._highInterval = value
  }
  public get initialScore() {
    return this._initialScore
  }
  public set initialScore(value) {
    this._initialScore = value
  }
}

export const userSettings = new UserSettings()
