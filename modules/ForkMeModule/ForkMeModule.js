function ForkMeModule() {
    this.loadStylesheet();
    $('body').append($('<div>')
        .addClass('github-fork-ribbon-wrapper left-bottom')
        .append($('<div>')
            .addClass('github-fork-ribbon')
            .append($('<a>')
                .attr('href', 'https://github.com/jplitza/lightdm-dashboard')
                .text('Fork me on GitHub')
            )
        )
    );
}
ForkMeModule.prototype = Object.create(BaseModule.prototype);
ForkMeModule.prototype.constructor = ForkMeModule;

new ForkMeModule();
